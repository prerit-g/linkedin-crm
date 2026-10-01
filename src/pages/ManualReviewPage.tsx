import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FileText, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useManualReviewContacts } from '../hooks/useContacts';
import { useContacts } from '../hooks/useContacts';
import ClassifyManuallyPanel from '../components/contacts/ClassifyManuallyPanel';
import { Contact, Category } from '../types/contact';

const ManualReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const manualReviewContacts = useManualReviewContacts();
  const { updateContact } = useContacts();
  const [updatingContactId, setUpdatingContactId] = useState<string | null>(null);
  const [showClassifyModal, setShowClassifyModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleViewContact = (contactId: string) => {
    navigate(`/contacts/${contactId}`);
  };

  const handleOpenClassifyModal = (contact: Contact) => {
    setSelectedContact(contact);
    setShowClassifyModal(true);
  };

  const handleCloseClassifyModal = () => {
    setShowClassifyModal(false);
    setSelectedContact(null);
  };

  const handleSaveClassification = (updates: Partial<Contact>) => {
    if (!selectedContact) return;
    
    updateContact(selectedContact.id, updates);
    toast.success('Contact classified successfully');
    handleCloseClassifyModal();
  };

  const handleClassifyAsCategory = async (contactId: string, category: Category) => {
    setUpdatingContactId(contactId);
    
    try {
      const contact = manualReviewContacts.find(c => c.id === contactId);
      if (!contact) {
        toast.error('Contact not found');
        return;
      }

      // Update contact with manual classification
      await updateContact(contactId, {
        category,
        confidence: 'HIGH' as const,
        status: 'MESSAGE_READY' as const,
        reviewStatus: 'APPROVED' as const,
        classificationReason: `Manually classified as ${category} by user`,
      });
      
      toast.success(`Contact classified as ${category}`);
    } catch (error) {
      console.error('Error classifying contact:', error);
      toast.error('Failed to classify contact');
    } finally {
      setUpdatingContactId(null);
    }
  };

  const handleMarkNotRelevant = async (contactId: string) => {
    setUpdatingContactId(contactId);
    
    try {
      await updateContact(contactId, {
        isRelevant: false,
        status: 'NOT_RELEVANT' as const,
        reviewStatus: 'REJECTED' as const,
        classificationReason: 'Manually marked as not relevant by user',
      });
      
      toast.success('Contact marked as not relevant');
    } catch (error) {
      console.error('Error marking contact:', error);
      toast.error('Failed to update contact');
    } finally {
      setUpdatingContactId(null);
    }
  };

  if (manualReviewContacts.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manual Review</h1>
          <p className="mt-1 text-sm text-gray-600">
            Contacts that need manual classification
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Review Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              variant="search"
              title="No contacts need review"
              description="Contacts with ambiguous classifications will appear here for manual review."
              icon={<FileText className="h-12 w-12 text-gray-400" />}
              action={{
                label: 'Add Contacts',
                onClick: () => navigate('/contacts/add'),
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group contacts by review reason
  const groupedContacts: Record<string, Contact[]> = {};
  manualReviewContacts.forEach(contact => {
    const reason = contact.classificationReason || 'Needs manual review';
    if (!groupedContacts[reason]) {
      groupedContacts[reason] = [];
    }
    groupedContacts[reason].push(contact);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manual Review</h1>
        <p className="mt-1 text-sm text-gray-600">
          {manualReviewContacts.length} contact{manualReviewContacts.length !== 1 ? 's' : ''} need manual classification
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
              Review Queue
              <Badge variant="primary" className="ml-2">
                {manualReviewContacts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedContacts).map(([reason, contacts]) => (
                <div key={reason} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{reason}</h3>
                  <div className="space-y-4">
                    {contacts.map(contact => (
                      <div key={contact.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {contact.currentJobTitle} at {contact.company}
                            </p>
                            {contact.personalizationNotes && (
                              <p className="mt-2 text-sm text-gray-500">
                                {contact.personalizationNotes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewContact(contact.id)}
                              disabled={updatingContactId === contact.id}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenClassifyModal(contact)}
                            disabled={updatingContactId === contact.id}
                            className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                          >
                            <FileText className="mr-1 h-3 w-3" />
                            Classify Manually
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClassifyAsCategory(contact.id, 'CAT_1')}
                            disabled={updatingContactId === contact.id}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Category 1
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClassifyAsCategory(contact.id, 'CAT_2')}
                            disabled={updatingContactId === contact.id}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Category 2
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClassifyAsCategory(contact.id, 'CAT_3')}
                            disabled={updatingContactId === contact.id}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Category 3
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkNotRelevant(contact.id)}
                            disabled={updatingContactId === contact.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Not Relevant
                          </Button>
                        </div>
                        
                        {updatingContactId === contact.id && (
                          <div className="mt-3 text-sm text-gray-500">
                            Updating contact...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900">Manual Review Guidelines</h3>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
            <span>Contacts appear here when classification confidence is LOW or ambiguous</span>
          </li>
          <li className="flex items-start">
            <FileText className="mr-2 h-4 w-4 flex-shrink-0 text-blue-500" />
            <span>Review the contact details and classification reason</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>Classify as Category 1 (Junior), 2 (Senior), or 3 (HR/Recruiting)</span>
          </li>
          <li className="flex items-start">
            <XCircle className="mr-2 h-4 w-4 flex-shrink-0 text-red-500" />
            <span>Mark as Not Relevant if outside target functions</span>
          </li>
          <li className="flex items-start">
            <Eye className="mr-2 h-4 w-4 flex-shrink-0 text-indigo-500" />
            <span>Click View to see full contact details before classifying</span>
          </li>
        </ul>
      </div>

      {/* Classify Manually Modal */}
      <Modal
        isOpen={showClassifyModal && selectedContact !== null}
        onClose={handleCloseClassifyModal}
        title="Manual Classification"
        size="lg"
      >
        {selectedContact && (
          <ClassifyManuallyPanel
            contact={selectedContact}
            onSave={handleSaveClassification}
            onClose={handleCloseClassifyModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManualReviewPage;