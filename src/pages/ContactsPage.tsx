import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import ContactsTable from '../components/contacts/ContactsTable';
import { UserPlus, Copy, ExternalLink, CheckCircle, User } from 'lucide-react';
import { useContacts } from '../hooks/useContacts';
import { openLinkedInProfile, getLinkedInManualActionReminder } from '../utils/linkedin';
import { safeCopyToClipboard } from '../utils/clipboard';

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { contacts, updateContact } = useContacts();
  
  // Read URL parameters
  const categoryFilter = searchParams.get('category') || '';
  const statusFilter = searchParams.get('status') || '';
  const relevantFilter = searchParams.get('relevant') === 'true';
  
  // Special handling for "RELEVANT" filter
  const effectiveStatusFilter = statusFilter;

  const handleCopyMessage = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact?.generatedMessage) {
      toast.error('No message available to copy');
      return;
    }

    await safeCopyToClipboard(
      contact.generatedMessage,
      () => toast.success('Message copied to clipboard'),
      (error) => toast.error(`Failed to copy: ${error}`)
    );
  };

  const handleOpenLinkedIn = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact?.linkedInUrl) {
      try {
        openLinkedInProfile(contact.linkedInUrl);
        toast(getLinkedInManualActionReminder(), {
          duration: 6000,
          icon: '🔗',
        });
      } catch (error) {
        console.error('Error opening LinkedIn:', error);
        toast.error('Invalid LinkedIn URL. Please check the URL and try again.');
      }
    } else {
      toast.error('No LinkedIn URL available');
    }
  };

  const handleApprove = (contactId: string) => {
    updateContact(contactId, { status: 'APPROVED' });
    toast.success('Contact approved');
  };

  const handleMarkContacted = (contactId: string) => {
    updateContact(contactId, { 
      status: 'CONTACTED',
      contactedDate: new Date().toISOString().split('T')[0]
    });
    toast.success('Marked as contacted');
  };

  if (contacts.length === 0) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your LinkedIn contacts and outreach
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate('/contacts/add')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>

        <EmptyState
          variant="contacts"
          title="No contacts yet"
          description="Start by adding your first LinkedIn contact to begin your outreach journey."
          action={{
            label: 'Add First Contact',
            onClick: () => navigate('/contacts/add'),
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your LinkedIn contacts and outreach
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/contacts/add')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
          <Button variant="primary" onClick={() => navigate('/contacts/add')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      <ContactsTable
        contacts={relevantFilter 
          ? contacts.filter(contact => contact.isRelevant === true)
          : contacts
        }
        onCopyMessage={handleCopyMessage}
        onOpenLinkedIn={handleOpenLinkedIn}
        onApprove={handleApprove}
        onMarkContacted={handleMarkContacted}
        initialCategoryFilter={categoryFilter}
        initialStatusFilter={effectiveStatusFilter}
      />
    </div>
  );
};

export default ContactsPage;