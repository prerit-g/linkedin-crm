import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import ContactsTable from '../components/contacts/ContactsTable';
import { Bell, ExternalLink, Copy, Eye } from 'lucide-react';
import { useFollowUpContacts } from '../hooks/useContacts';
import { useContacts } from '../hooks/useContacts';
import toast from 'react-hot-toast';
import { openLinkedInProfile, getLinkedInManualActionReminder } from '../utils/linkedin';
import { safeCopyToClipboard } from '../utils/clipboard';

const FollowUpsPage: React.FC = () => {
  const navigate = useNavigate();
  const followUpContacts = useFollowUpContacts();
  const { updateContact } = useContacts();

  const handleCopyMessage = async (contactId: string) => {
    const contact = followUpContacts.find(c => c.id === contactId);
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
    const contact = followUpContacts.find(c => c.id === contactId);
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

  const handleViewContact = (contactId: string) => {
    navigate(`/contacts/${contactId}`);
  };

  // Calculate days overdue for each contact
  const contactsWithOverdue = followUpContacts.map(contact => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const followUpDate = new Date(contact.followUpDate);
    followUpDate.setHours(0, 0, 0, 0);
    
    const daysOverdue = Math.floor((today.getTime() - followUpDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      ...contact,
      daysOverdue: Math.max(0, daysOverdue),
    };
  }).sort((a, b) => b.daysOverdue - a.daysOverdue); // Sort by most overdue first

  const overdueCount = contactsWithOverdue.filter(c => c.daysOverdue > 0).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Follow-Ups</h1>
        <p className="mt-1 text-sm text-gray-600">
          Contacts with follow-ups due
        </p>
      </div>

      {contactsWithOverdue.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Follow-Ups Due</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              variant="search"
              title="No follow-ups due"
              description="Follow-ups will appear here once contacts are marked as contacted and have a follow-up date set."
              icon={<Bell className="h-12 w-12 text-gray-400" />}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-amber-500" />
                  Follow-Ups Due
                  {overdueCount > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {overdueCount} overdue
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Follow-Up Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Days Overdue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contactsWithOverdue.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contact.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              contact.status === 'CONTACTED' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {contact.status === 'CONTACTED' ? 'Contacted' : 'No Response'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(contact.followUpDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              contact.daysOverdue === 0
                                ? 'bg-blue-100 text-blue-800'
                                : contact.daysOverdue > 7
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {contact.daysOverdue === 0 
                                ? 'Due today' 
                                : `${contact.daysOverdue} day${contact.daysOverdue !== 1 ? 's' : ''} overdue`
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewContact(contact.id)}
                                title="View Contact"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyMessage(contact.id)}
                                title="Copy Message"
                                disabled={!contact.generatedMessage}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenLinkedIn(contact.id)}
                                title="Open LinkedIn"
                                disabled={!contact.linkedInUrl}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border border-gray-200 bg-amber-50 p-4">
            <h3 className="text-sm font-medium text-amber-900 mb-2">Follow-Up Reminder</h3>
            <p className="text-sm text-amber-700">
              Remember to send your follow-up manually on LinkedIn. Follow-up messages should be:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-amber-700">
              <li className="flex items-start">
                <Bell className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
                <span>Sent 5-7 days after initial contact</span>
              </li>
              <li className="flex items-start">
                <Copy className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
                <span>Reference your previous conversation</span>
              </li>
              <li className="flex items-start">
                <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
                <span>Keep it concise and professional</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default FollowUpsPage;