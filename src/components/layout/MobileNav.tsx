import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Bell,
  Settings,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
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
      label: 'Messages',
      to: '/messages',
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Review',
      to: '/review',
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: 'Follow-Ups',
      to: '/followups',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      to: '/settings',
    },
  ];

  return (
    <div className="flex h-16 items-center justify-around border-t border-gray-200 bg-white px-4 shadow-sm">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center rounded-lg px-2 py-2',
              'transition-colors',
              isActive
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            )
          }
        >
          {item.icon}
          <span className="mt-1 text-xs font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};