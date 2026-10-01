import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { ArrowLeft } from 'lucide-react';
import { useContacts } from '../hooks/useContacts';
import { useAddContactGuard } from '../hooks/useOfflineGuard';
import { useOffline } from '../hooks/useOffline';
import { ProfileInput } from '../types/contact';
import { validateProfileInput, isDuplicateContact } from '../utils/validation';
import ClassificationPreview from '../components/contacts/ClassificationPreview';

const AddContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { contacts, addContact } = useContacts();
  const { canAddContact } = useAddContactGuard();
  const { isOnline } = useOffline();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<ProfileInput>({
    linkedInUrl: '',
    firstName: '',
    lastName: '',
    currentJobTitle: '',
    company: '',
    headline: '',
    about: '',
    location: '',
    userNotes: '',
  });

  // Show preview when job title is entered
  useEffect(() => {
    setShowPreview(!!formData.currentJobTitle.trim());
  }, [formData.currentJobTitle]);

  const handleInputChange = (field: keyof ProfileInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if online before proceeding
    if (!canAddContact()) {
      return;
    }
    
    // Validate form
    const validationResult = validateProfileInput(formData);
    if (!validationResult.isValid) {
      const newErrors: Record<string, string> = {};
      validationResult.errors.forEach(error => {
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    // Check for duplicates
    const existingContacts = contacts.map(contact => ({
      linkedInUrl: contact.linkedInUrl,
      firstName: contact.firstName,
      lastName: contact.lastName,
      company: contact.company,
      currentJobTitle: contact.currentJobTitle,
    }));

    if (isDuplicateContact(formData, existingContacts)) {
      toast.error('This contact already exists in your CRM', {
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await addContact(formData);
      
      if (result.success) {
        toast.success('Contact added and classified successfully!');
        setTimeout(() => {
          navigate('/contacts');
        }, 1500);
      } else if (result.duplicate) {
        toast.error('This contact already exists in your CRM', {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      id: 'linkedInUrl',
      label: 'LinkedIn URL',
      placeholder: 'https://linkedin.com/in/username',
      required: true,
      type: 'url',
      value: formData.linkedInUrl,
      error: errors.linkedInUrl,
    },
    {
      id: 'firstName',
      label: 'First Name',
      placeholder: 'John',
      required: true,
      value: formData.firstName,
      error: errors.firstName,
    },
    {
      id: 'lastName',
      label: 'Last Name',
      placeholder: 'Doe',
      required: false,
      value: formData.lastName,
      error: errors.lastName,
    },
    {
      id: 'currentJobTitle',
      label: 'Current Job Title',
      placeholder: 'Accounts Payable Associate',
      required: true,
      value: formData.currentJobTitle,
      error: errors.currentJobTitle,
    },
    {
      id: 'company',
      label: 'Company',
      placeholder: 'Company Inc.',
      required: true,
      value: formData.company,
      error: errors.company,
    },
    {
      id: 'location',
      label: 'Location',
      placeholder: 'City, Country',
      required: false,
      value: formData.location,
      error: errors.location,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/contacts')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Add Contact</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add a LinkedIn contact to your CRM with automatic classification
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map((field) => (
                    <Input
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      placeholder={field.placeholder}
                      required={field.required}
                      type={field.type as any}
                      value={field.value}
                      error={field.error}
                      onChange={(e) => handleInputChange(field.id as keyof ProfileInput, e.target.value)}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>

                <Textarea
                  id="headline"
                  label="Headline / About"
                  placeholder="Paste relevant parts from the LinkedIn profile..."
                  rows={3}
                  value={formData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  disabled={isSubmitting}
                />

                <Textarea
                  id="about"
                  label="About Section"
                  placeholder="Paste the 'About' section from LinkedIn..."
                  rows={3}
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  disabled={isSubmitting}
                />

                <Textarea
                  id="userNotes"
                  label="Additional Notes"
                  placeholder="Any additional context or observations..."
                  rows={2}
                  value={formData.userNotes}
                  onChange={(e) => handleInputChange('userNotes', e.target.value)}
                  disabled={isSubmitting}
                />

                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                  <p className="font-medium">Classification Engine</p>
                  <p className="mt-1">
                    After submission, the system will automatically classify the contact,
                    determine relevance, assign a category, and generate a personalized message.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/contacts')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !isOnline}
                    title={!isOnline ? "This feature requires an internet connection. Please reconnect to add new contacts." : ""}
                  >
                    {isSubmitting ? 'Classifying...' : 'Classify & Generate Message'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Preview */}
        <div>
          <ClassificationPreview 
            profile={formData}
            isLoading={isSubmitting}
          />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>What Happens Next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                    <span className="text-xs font-semibold text-indigo-800">1</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Automatic Classification</p>
                  <p className="text-sm text-gray-500">
                    The system analyzes the profile and classifies it based on job title, function, and seniority.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                    <span className="text-xs font-semibold text-indigo-800">2</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Message Generation</p>
                  <p className="text-sm text-gray-500">
                    A personalized outreach message is generated based on the category and profile details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                    <span className="text-xs font-semibold text-indigo-800">3</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Workflow Status</p>
                  <p className="text-sm text-gray-500">
                    Contact is assigned a status: Message Ready, Manual Review, or Not Relevant.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                    <span className="text-xs font-semibold text-indigo-800">4</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Review & Outreach</p>
                  <p className="text-sm text-gray-500">
                    Review the classification, approve the message, and begin your LinkedIn outreach.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddContactPage;