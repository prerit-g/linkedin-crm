/**
 * Clipboard utilities with better error handling
 * Ensures clipboard operations are user-initiated and have proper fallbacks
 */

/**
 * Copy text to clipboard with enhanced error handling
 * Returns success status and error message if any
 */
export async function copyToClipboard(text: string): Promise<{ success: boolean; error?: string }> {
  // Validate input
  if (!text || typeof text !== 'string') {
    return { 
      success: false, 
      error: 'No text provided to copy' 
    };
  }

  // Check if clipboard API is available
  if (!navigator.clipboard) {
    return { 
      success: false, 
      error: 'Clipboard API not available. Your browser may not support this feature.' 
    };
  }

  try {
    // Check for secure context (clipboard requires HTTPS or localhost)
    if (!window.isSecureContext) {
      return {
        success: false,
        error: 'Clipboard requires secure context (HTTPS or localhost). Please serve the app over HTTPS.'
      };
    }

    // Check for clipboard write permission
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
        if (result.state === 'denied') {
          return {
            success: false,
            error: 'Clipboard permission denied. Please allow clipboard access in your browser settings.'
          };
        }
      } catch (permissionError) {
        // Permission query may fail in some browsers, continue anyway
        console.warn('Clipboard permission query failed:', permissionError);
      }
    }

    // Attempt to copy using modern clipboard API
    await navigator.clipboard.writeText(text);
    return { success: true };
    
  } catch (error) {
    console.error('Clipboard copy error:', error);
    
    // Provide more specific error messages
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        return {
          success: false,
          error: 'Clipboard permission denied. The browser prevented the clipboard operation.'
        };
      }
      if (error.name === 'SecurityError') {
        return {
          success: false,
          error: 'Security error. Clipboard requires user interaction or secure context.'
        };
      }
    }
    
    // Try fallback method for older browsers
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback clipboard copy method using execCommand
 * This works in older browsers but has limitations
 */
function fallbackCopyToClipboard(text: string): { success: boolean; error?: string } {
  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    
    // Style it to be invisible
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    
    // Add to document
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    
    const success = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textarea);
    
    if (!success) {
      return {
        success: false,
        error: 'Failed to copy text using fallback method.'
      };
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Fallback clipboard copy error:', error);
    return {
      success: false,
      error: 'Clipboard operation failed. Please copy manually using Ctrl+C.'
    };
  }
}

/**
 * Check if clipboard API is supported
 */
export function isClipboardSupported(): boolean {
  return typeof navigator !== 'undefined' && 
         typeof navigator.clipboard !== 'undefined' &&
         typeof navigator.clipboard.writeText === 'function';
}

/**
 * Check if we're in a secure context (required for clipboard API)
 */
export function isSecureContextForClipboard(): boolean {
  return window.isSecureContext;
}

/**
 * Get clipboard support status for debugging
 */
export function getClipboardSupportInfo(): {
  clipboardSupported: boolean;
  secureContext: boolean;
  fallbackAvailable: boolean;
} {
  return {
    clipboardSupported: isClipboardSupported(),
    secureContext: isSecureContextForClipboard(),
    fallbackAvailable: typeof document !== 'undefined' && 
                       typeof document.execCommand === 'function' &&
                       document.execCommand('copy') !== undefined,
  };
}

/**
 * Safe wrapper for clipboard operations with toast notifications
 * This is the main function to use in components
 */
export async function safeCopyToClipboard(
  text: string, 
  onSuccess?: (text: string) => void,
  onError?: (error: string) => void
): Promise<boolean> {
  const result = await copyToClipboard(text);
  
  if (result.success) {
    onSuccess?.(text);
    return true;
  } else {
    onError?.(result.error || 'Unknown clipboard error');
    return false;
  }
}

/**
 * Copy LinkedIn outreach message with additional context
 */
export async function copyLinkedInMessage(
  message: string,
  contactName?: string
): Promise<{ success: boolean; error?: string }> {
  if (!message) {
    return {
      success: false,
      error: 'No message provided to copy'
    };
  }
  
  const result = await copyToClipboard(message);
  
  // Add debug info in console for troubleshooting
  if (!result.success) {
    console.warn('Failed to copy LinkedIn message:', {
      error: result.error,
      contactName,
      messageLength: message.length,
      clipboardInfo: getClipboardSupportInfo(),
    });
  }
  
  return result;
}