import React, { useState } from 'react';
import { Contact, Category, ContactFunction } from '../../types/contact';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { generateMessage } from '../../engine/messageGeneration';
import { validateMessage } from '../../engine/validator';

interface ClassifyManuallyPanelProps {
  contact: Contact;
  onSave: (updates: Partial<Contact>) => void;
  onClose: () => void;
}

const ClassifyManuallyPanel: React.FC<ClassifyManuallyPanelProps> = ({
  contact,
  onSave,
  onClose,
}) => {
  const [category, setCategory] = useState<Category>(contact.category);
  const [functionType, setFunctionType] = useState<ContactFunction>(contact.function);
  const [seniority, setSeniority] = useState(contact.seniority || '');
  const [personalizationNotes, setPersonalizationNotes] = useState(contact.personalizationNotes || '');
  const [generatedMessage, setGeneratedMessage] = useState(contact.generatedMessage || '');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const functionOptions: { value: ContactFunction; label: string }[] = [
    { value: 'ACCOUNTS_PAYABLE', label: 'Accounts Payable' },
    { value: 'ACCOUNTS_RECEIVABLE', label: 'Accounts Receivable' },
    { value: 'P2P', label: 'P2P' },
    { value: 'O2C', label: 'O2C' },
    { value: 'R2R', label: 'R2R' },
    { value: 'ACCOUNTING', label: 'Accounting' },
    { value: 'FINANCE_OPERATIONS', label: 'Finance Operations' },
    { value: 'FINANCE', label: 'Finance' },
    { value: 'FINTECH', label: 'FinTech' },
    { value: 'HR', label: 'HR' },
    { value: 'UNKNOWN', label: 'Unknown' },
  ];

  const categoryOptions: { value: Category; label: string }[] = [
    { value: 'CAT_1', label: 'Category 1 (Junior/Associate)' },
    { value: 'CAT_2', label: 'Category 2 (Senior/Manager)' },
    { value: 'CAT_3', label: 'Category 3 (HR/Recruiting)' },
  ];

  const handleGenerateMessage = () => {
    setIsGenerating(true);
    try {
      // Create updated contact object with manual classification
      const updatedContact: Contact = {
        ...contact,
        category,
        function: functionType,
        seniority,
        personalizationNotes,
      };

      const message = generateMessage(updatedContact);
      setGeneratedMessage(message);
      
      // Validate the generated message
      setIsValidating(true);
      const validation = validateMessage({ ...updatedContact, generatedMessage: message });
      setValidationErrors(validation.failures);
      
      if (validation.valid) {
        setValidationErrors([]);
      }
    } catch (error) {
      console.error('Error generating message:', error);
      setValidationErrors(['Failed to generate message']);
    } finally {
      setIsGenerating(false);
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    if (!category || functionType === 'UNKNOWN') {
      setValidationErrors(['Please select a category and function']);
      return;
    }

    const updates: Partial<Contact> = {
      category,
      function: functionType,
      seniority,
      personalizationNotes,
      confidence: 'HIGH' as const,
      classificationReason: `Manually classified as ${category} (${functionType})`,
      reviewStatus: 'APPROVED' as const,
    };

    // If we have a generated message and it's valid, include it
    if (generatedMessage.trim()) {
      updates.generatedMessage = generatedMessage;
      const validation = validateMessage({ ...contact, ...updates, generatedMessage });
      
      if (validation.valid) {
        updates.messageStatus = 'READY' as const;
        updates.status = 'MESSAGE_READY' as const;
      } else {
        updates.messageStatus = 'DRAFT' as const;
        updates.status = 'REVIEW_REQUIRED' as const;
        updates.classificationReason += `\nValidation failures: ${validation.failures.join(', ')}`;
      }
    } else {
      updates.status = 'REVIEW_REQUIRED' as const;
      updates.messageStatus = 'NONE' as const;
    }

    onSave(updates);
  };

  return (
    <div className="space-y-6">
      {/* Current classification info */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Current Classification</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Reason for review:</span>
                <Badge variant="warning">{contact.classificationReason || 'Needs manual classification'}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Original confidence:</span>
                <Badge variant={contact.confidence === 'HIGH' ? 'success' : contact.confidence === 'MEDIUM' ? 'warning' : 'error'}>
                  {contact.confidence}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual classification form */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Manual Classification</h3>
          
          <div className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={category === option.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCategory(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Function selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Function
              </label>
              <select
                value={functionType}
                onChange={(e) => setFunctionType(e.target.value as ContactFunction)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {functionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Seniority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seniority
              </label>
              <input
                type="text"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                placeholder="e.g., Senior, Manager, Associate, Executive"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Personalization Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personalization Notes (Optional)
              </label>
              <Textarea
                value={personalizationNotes}
                onChange={(e) => setPersonalizationNotes(e.target.value)}
                placeholder="Additional context for message personalization..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message generation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Message Preview</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateMessage}
              disabled={isGenerating || !category || functionType === 'UNKNOWN'}
            >
              {isGenerating ? 'Generating...' : 'Generate Message'}
            </Button>
          </div>

          {generatedMessage && (
            <div className="space-y-4">
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Generated Message</span>
                  <div className="text-xs text-gray-500">
                    {generatedMessage.length} characters
                  </div>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                  {generatedMessage}
                </pre>
              </div>

              {/* Validation results */}
              {isValidating && (
                <div className="text-sm text-gray-500">Validating message...</div>
              )}
              
              {validationErrors.length > 0 && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Validation Issues</h4>
                  <ul className="space-y-1 text-sm text-red-700">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validationErrors.length === 0 && generatedMessage && !isValidating && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-green-800">✓ Message validated successfully</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {!generatedMessage && (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-600">
                Click "Generate Message" to create a personalized message based on your manual classification.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!category || functionType === 'UNKNOWN'}
        >
          Save Classification
        </Button>
      </div>
    </div>
  );
};

export default ClassifyManuallyPanel;