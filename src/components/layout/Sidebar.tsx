import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Bell,
  Settings,
} from 'lucide-react';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  to: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: 'Dashboard',
    to: '/',
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: 'Contacts',
    to: '/contacts',
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    label: 'Message Queue',
    to: '/messages',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: 'Manual Review',
    to: '/review',
    badge: 3, // Example badge count
  },
  {
    icon: <Bell className="h-5 w-5" />,
    label: 'Follow-Ups',
    to: '/followups',
    badge: 2, // Example badge count
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: 'Settings',
    to: '/settings',
  },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="flex h-full w-60 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Outreach CRM
        </h1>
        <span className="ml-2 rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
          Beta
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-gray-100',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  : 'text-gray-700'
              )
            }
          >
            {item.icon}
            <span className="ml-3 flex-1">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <Badge variant="primary" size="sm" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <div className="font-medium">PWA Installed</div>
          <div className="mt-1">Version 1.0.0</div>
        </div>
      </div>
    </div>
  );
};