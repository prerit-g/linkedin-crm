/**
 * Tests for clipboard utilities
 */

import { 
  copyToClipboard,
  isClipboardSupported,
  isSecureContextForClipboard,
  getClipboardSupportInfo,
  safeCopyToClipboard,
  copyLinkedInMessage
} from './clipboard';

// Mock the clipboard API for testing
const mockClipboard = {
  writeText: jest.fn(),
};

// Mock permissions API
const mockPermissions = {
  query: jest.fn(),
};

// Mock document.execCommand
const mockExecCommand = jest.fn();

// Mock global objects
global.navigator = {
  ...global.navigator,
  clipboard: mockClipboard,
  permissions: mockPermissions,
} as any;

global.document = {
  ...global.document,
  execCommand: mockExecCommand,
} as any;

global.window = {
  ...global.window,
  isSecureContext: true,
} as any;

beforeEach(() => {
  jest.clearAllMocks();
  
  // Reset mocks to default behavior
  mockClipboard.writeText.mockResolvedValue(undefined);
  mockPermissions.query.mockResolvedValue({ state: 'granted' });
  mockExecCommand.mockReturnValue(true);
});

describe('Clipboard Utilities', () => {
  describe('isClipboardSupported', () => {
    it('should return true when clipboard API is available', () => {
      expect(isClipboardSupported()).toBe(true);
    });

    it('should return false when clipboard API is not available', () => {
      const originalClipboard = global.navigator.clipboard;
      global.navigator.clipboard = undefined as any;
      expect(isClipboardSupported()).toBe(false);
      global.navigator.clipboard = originalClipboard;
    });
  });

  describe('isSecureContextForClipboard', () => {
    it('should return true for secure contexts', () => {
      global.window.isSecureContext = true;
      expect(isSecureContextForClipboard()).toBe(true);
    });

    it('should return false for insecure contexts', () => {
      global.window.isSecureContext = false;
      expect(isSecureContextForClipboard()).toBe(false);
      global.window.isSecureContext = true; // Reset
    });
  });

  describe('getClipboardSupportInfo', () => {
    it('should return correct support information', () => {
      const info = getClipboardSupportInfo();
      expect(info).toEqual({
        clipboardSupported: true,
        secureContext: true,
        fallbackAvailable: true,
      });
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text successfully', async () => {
      const result = await copyToClipboard('test message');
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockClipboard.writeText).toHaveBeenCalledWith('test message');
    });

    it('should return error for empty text', async () => {
      const result = await copyToClipboard('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('No text provided to copy');
      expect(mockClipboard.writeText).not.toHaveBeenCalled();
    });

    it('should return error when clipboard API is not available', async () => {
      const originalClipboard = global.navigator.clipboard;
      global.navigator.clipboard = undefined as any;
      
      const result = await copyToClipboard('test message');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Clipboard API not available');
      
      global.navigator.clipboard = originalClipboard;
    });

    it('should return error for insecure context', async () => {
      global.window.isSecureContext = false;
      
      const result = await copyToClipboard('test message');
      expect(result.success).toBe(false);
      expect(result.error).toContain('secure context');
      
      global.window.isSecureContext = true; // Reset
    });

    it('should return error when permission is denied', async () => {
      mockPermissions.query.mockResolvedValue({ state: 'denied' });
      
      const result = await copyToClipboard('test message');
      expect(result.success).toBe(false);
      expect(result.error).toContain('permission denied');
      expect(mockClipboard.writeText).not.toHaveBeenCalled();
    });

    it('should fall back to execCommand when modern API fails', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
      
      const result = await copyToClipboard('test message');
      expect(mockClipboard.writeText).toHaveBeenCalled();
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      
      // The success depends on mockExecCommand returning true
      expect(result.success).toBe(true);
    });

    it('should handle execCommand failure', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
      mockExecCommand.mockReturnValue(false);
      
      const result = await copyToClipboard('test message');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to copy');
    });
  });

  describe('safeCopyToClipboard', () => {
    it('should call success callback on success', async () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();
      
      const result = await safeCopyToClipboard('test message', onSuccess, onError);
      
      expect(result).toBe(true);
      expect(onSuccess).toHaveBeenCalledWith('test message');
      expect(onError).not.toHaveBeenCalled();
    });

    it('should call error callback on failure', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
      mockExecCommand.mockReturnValue(false);
      
      const onSuccess = jest.fn();
      const onError = jest.fn();
      
      const result = await safeCopyToClipboard('test message', onSuccess, onError);
      
      expect(result).toBe(false);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('copyLinkedInMessage', () => {
    it('should copy LinkedIn message successfully', async () => {
      const result = await copyLinkedInMessage('Hi John, test message', 'John Doe');
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockClipboard.writeText).toHaveBeenCalledWith('Hi John, test message');
    });

    it('should return error for empty message', async () => {
      const result = await copyLinkedInMessage('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('No message provided to copy');
      expect(mockClipboard.writeText).not.toHaveBeenCalled();
    });

    it('should handle failure gracefully', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
      mockExecCommand.mockReturnValue(false);
      
      const result = await copyLinkedInMessage('test message');
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });
});