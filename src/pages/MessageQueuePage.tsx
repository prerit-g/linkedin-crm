import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import ContactsTable from '../components/contacts/ContactsTable';
import { MessageSquare, Copy, ExternalLink, CheckCircle } from 'lucide-react';
import { useMessageQueueContacts } from '../hooks/useContacts';
import { useContacts } from '../hooks/useContacts';
import { openLinkedInProfile, getLinkedInManualActionReminder } from '../utils/linkedin';
import { safeCopyToClipboard } from '../utils/clipboard';

const MessageQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const messageQueueContacts = useMessageQueueContacts();
  const { updateContact } = useContacts();
  const [activeTab, setActiveTab] = useState<'ready' | 'approved'>('ready');

  const handleCopyMessage = async (contactId: string) => {
    const contact = messageQueueContacts.find(c => c.id === contactId);
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
    const contact = messageQueueContacts.find(c => c.id === contactId);
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
    toast.success('Contact approved and ready for outreach');
  };

  const handleApproveAllReady = () => {
    const readyContacts = messageQueueContacts.filter(c => c.status === 'MESSAGE_READY');
    if (readyContacts.length === 0) {
      toast('No contacts ready to approve');
      return;
    }

    if (window.confirm(`Approve all ${readyContacts.length} ready contacts?`)) {
      readyContacts.forEach(contact => {
        updateContact(contact.id, { status: 'APPROVED' });
      });
      toast.success(`Approved ${readyContacts.length} contacts`);
    }
  };

  // Filter contacts by active tab
  const filteredContacts = messageQueueContacts.filter(contact => {
    if (activeTab === 'ready') {
      return contact.status === 'MESSAGE_READY';
    } else {
      return contact.status === 'APPROVED';
    }
  });

  if (messageQueueContacts.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Message Queue</h1>
          <p className="mt-1 text-sm text-gray-600">
            Contacts with messages ready for outreach
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contacts Ready for Outreach</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              variant="search"
              title="No messages ready"
              description="Messages will appear here once contacts are classified and marked as MESSAGE READY or APPROVED."
              icon={<MessageSquare className="h-12 w-12 text-gray-400" />}
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Message Queue</h1>
        <p className="mt-1 text-sm text-gray-600">
          {activeTab === 'ready' 
            ? `${filteredContacts.length} contact${filteredContacts.length !== 1 ? 's' : ''} ready for approval`
            : `${filteredContacts.length} contact${filteredContacts.length !== 1 ? 's' : ''} approved for outreach`
          }
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {messageQueueContacts.filter(c => c.status === 'MESSAGE_READY').length}
              </div>
              <div className="text-sm font-medium text-gray-700">Ready for Review</div>
              <div className="text-xs text-gray-500">Need approval before outreach</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {messageQueueContacts.filter(c => c.status === 'APPROVED').length}
              </div>
              <div className="text-sm font-medium text-gray-700">Approved</div>
              <div className="text-xs text-gray-500">Ready for LinkedIn outreach</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {messageQueueContacts.filter(c => c.generatedMessage).length}
              </div>
              <div className="text-sm font-medium text-gray-700">Messages Generated</div>
              <div className="text-xs text-gray-500">Personalized messages created</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('ready')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ready'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ready to Approve
            <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
              {messageQueueContacts.filter(c => c.status === 'MESSAGE_READY').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'approved'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Approved
            <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
              {messageQueueContacts.filter(c => c.status === 'APPROVED').length}
            </span>
          </button>
        </nav>
      </div>

      {/* Bulk actions for ready tab */}
      {activeTab === 'ready' && filteredContacts.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-indigo-50 p-4">
          <div>
            <p className="text-sm font-medium text-indigo-900">
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} ready for approval
            </p>
            <p className="text-sm text-indigo-700">
              Review and approve messages before LinkedIn outreach
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleApproveAllReady}
            className="whitespace-nowrap"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve All Ready
          </Button>
        </div>
      )}

      {/* Empty states */}
      {filteredContacts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'ready' ? 'Ready to Approve' : 'Approved'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              variant="search"
              title={
                activeTab === 'ready'
                  ? 'No messages ready for approval'
                  : 'No approved messages'
              }
              description={
                activeTab === 'ready'
                  ? 'Messages will appear here once contacts are classified as MESSAGE_READY.'
                  : 'Approved messages will appear here after you approve contacts from the Ready tab.'
              }
              icon={<MessageSquare className="h-12 w-12 text-gray-400" />}
              action={
                activeTab === 'ready'
                  ? {
                      label: 'Add Contacts',
                      onClick: () => navigate('/contacts/add'),
                    }
                  : undefined
              }
            />
          </CardContent>
        </Card>
      ) : (
        <ContactsTable
          contacts={filteredContacts}
          onCopyMessage={handleCopyMessage}
          onOpenLinkedIn={handleOpenLinkedIn}
          onApprove={handleApprove}
          showFilters={true}
        />
      )}
      
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900">Message Queue Workflow</h3>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>Contacts automatically enter the queue when classified as MESSAGE_READY</span>
          </li>
          <li className="flex items-start">
            <Copy className="mr-2 h-4 w-4 flex-shrink-0 text-blue-500" />
            <span>Review and copy generated messages for each contact</span>
          </li>
          <li className="flex items-start">
            <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0 text-indigo-500" />
            <span>Approve messages before opening LinkedIn for manual outreach</span>
          </li>
          <li className="flex items-start">
            <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
            <span>After sending message on LinkedIn, return to mark as CONTACTED</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MessageQueuePage;