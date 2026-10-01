import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contact } from '../../types/contact';
import { Button } from '../ui/Button';
import { StatusPill } from '../ui/StatusPill';
import { CategoryBadge } from '../ui/CategoryBadge';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Eye, Copy, ExternalLink, CheckCircle, User } from 'lucide-react';

export interface ContactsTableProps {
  contacts: Contact[];
  onCopyMessage?: (contactId: string) => void;
  onOpenLinkedIn?: (contactId: string) => void;
  onApprove?: (contactId: string) => void;
  onMarkContacted?: (contactId: string) => void;
  showFilters?: boolean;
  initialCategoryFilter?: string;
  initialStatusFilter?: string;
  initialSearchTerm?: string;
}

const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  onCopyMessage,
  onOpenLinkedIn,
  onApprove,
  onMarkContacted,
  showFilters = true,
  initialCategoryFilter = '',
  initialStatusFilter = '',
  initialSearchTerm = '',
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filterStatus, setFilterStatus] = useState(initialStatusFilter);
  const [filterCategory, setFilterCategory] = useState(initialCategoryFilter);

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      !searchTerm ||
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.currentJobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      !filterStatus || contact.status === filterStatus;
    
    const matchesCategory = 
      !filterCategory || contact.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Status options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'NEW', label: 'New' },
    { value: 'REVIEW_REQUIRED', label: 'Review Required' },
    { value: 'MESSAGE_READY', label: 'Message Ready' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'REPLIED', label: 'Replied' },
    { value: 'NO_RESPONSE', label: 'No Response' },
    { value: 'NOT_RELEVANT', label: 'Not Relevant' },
  ];

  // Category options
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'CAT_1', label: 'Category 1' },
    { value: 'CAT_2', label: 'Category 2' },
    { value: 'CAT_3', label: 'Category 3' },
    { value: 'MANUAL_REVIEW', label: 'Manual Review' },
  ];

  // Desktop table view
  const renderDesktopTable = () => (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role / Company
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Confidence
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredContacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.function || 'Unknown function'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {contact.currentJobTitle}
                </div>
                <div className="text-sm text-gray-500">
                  {contact.company}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <CategoryBadge category={contact.category} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ConfidenceBadge confidence={contact.confidence} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusPill status={contact.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {contact.generatedMessage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopyMessage?.(contact.id)}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenLinkedIn?.(contact.id)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  {contact.status === 'MESSAGE_READY' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove?.(contact.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {contact.status === 'APPROVED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkContacted?.(contact.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {filteredContacts.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                No contacts found. Try adjusting your filters or add a new contact.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Mobile card view
  const renderMobileCards = () => (
    <div className="space-y-4">
      {filteredContacts.map((contact) => (
        <Card key={contact.id} variant="elevated">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{contact.currentJobTitle}</p>
                  <p className="text-sm text-gray-500">{contact.company}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <CategoryBadge category={contact.category} size="sm" />
                <ConfidenceBadge confidence={contact.confidence} size="sm" />
                <StatusPill status={contact.status} size="sm" />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                    className="text-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {contact.generatedMessage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopyMessage?.(contact.id)}
                      className="text-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenLinkedIn?.(contact.id)}
                    className="text-gray-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  {contact.status === 'MESSAGE_READY' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove?.(contact.id)}
                      className="text-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {contact.status === 'APPROVED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkContacted?.(contact.id)}
                      className="text-blue-600"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">
            No contacts found. Try adjusting your filters or add a new contact.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {showFilters && (
        <Card className="mb-6">
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <Input
                  placeholder="Search by name, company, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="sm:col-span-1">
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredContacts.length} of {contacts.length} contacts
            </div>
          </div>
        </Card>
      )}

      {/* Desktop view */}
      <div className="hidden lg:block">
        {renderDesktopTable()}
      </div>

      {/* Mobile view */}
      <div className="lg:hidden">
        {renderMobileCards()}
      </div>
    </div>
  );
};

export default ContactsTable;