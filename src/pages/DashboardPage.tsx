import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UserPlus, Users, MessageSquare, CheckCircle, Bell, FileText, AlertCircle } from 'lucide-react';
import { useDashboardMetrics } from '../hooks/useContacts';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const metrics = useDashboardMetrics();
  
  const metricCards = [
    { 
      title: 'Total Contacts', 
      value: metrics.total.toString(), 
      icon: <Users className="h-5 w-5" />, 
      color: 'bg-blue-100 text-blue-600',
      onClick: () => navigate('/contacts')
    },
    { 
      title: 'Relevant Contacts', 
      value: metrics.relevant.toString(), 
      icon: <Users className="h-5 w-5" />, 
      color: 'bg-green-100 text-green-600',
      onClick: () => navigate('/contacts?relevant=true')
    },
    { 
      title: 'Category 1', 
      value: metrics.cat1.toString(), 
      icon: <Users className="h-5 w-5" />, 
      color: 'bg-blue-100 text-blue-600',
      onClick: () => navigate('/contacts?category=CAT_1')
    },
    { 
      title: 'Category 2', 
      value: metrics.cat2.toString(), 
      icon: <Users className="h-5 w-5" />, 
      color: 'bg-purple-100 text-purple-600',
      onClick: () => navigate('/contacts?category=CAT_2')
    },
    { 
      title: 'Category 3', 
      value: metrics.cat3.toString(), 
      icon: <Users className="h-5 w-5" />, 
      color: 'bg-teal-100 text-teal-600',
      onClick: () => navigate('/contacts?category=CAT_3')
    },
    { 
      title: 'Manual Review', 
      value: metrics.manualReview.toString(), 
      icon: <FileText className="h-5 w-5" />, 
      color: 'bg-amber-100 text-amber-600',
      onClick: () => navigate('/review')
    },
    { 
      title: 'Messages Ready', 
      value: metrics.messagesReady.toString(), 
      icon: <MessageSquare className="h-5 w-5" />, 
      color: 'bg-blue-100 text-blue-600',
      onClick: () => navigate('/messages')
    },
    { 
      title: 'Approved', 
      value: metrics.approved.toString(), 
      icon: <CheckCircle className="h-5 w-5" />, 
      color: 'bg-indigo-100 text-indigo-600',
      onClick: () => navigate('/messages')
    },
    { 
      title: 'Contacted', 
      value: metrics.contacted.toString(), 
      icon: <Users className="h-5 w-5" />, 
      color: 'bg-green-100 text-green-600',
      onClick: () => navigate('/contacts')
    },
    { 
      title: 'Replies', 
      value: metrics.replied.toString(), 
      icon: <MessageSquare className="h-5 w-5" />, 
      color: 'bg-emerald-100 text-emerald-600',
      onClick: () => navigate('/contacts')
    },
    { 
      title: 'Follow-Ups Due', 
      value: metrics.followUpsDue.toString(), 
      icon: <Bell className="h-5 w-5" />, 
      color: 'bg-orange-100 text-orange-600',
      onClick: () => navigate('/followups')
    },
    { 
      title: 'Not Relevant', 
      value: metrics.notRelevant.toString(), 
      icon: <AlertCircle className="h-5 w-5" />, 
      color: 'bg-red-100 text-red-600',
      onClick: () => navigate('/contacts')
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Overview of your outreach CRM activity
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/contacts/add')}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metricCards.map((card) => (
          <button
            key={card.title}
            onClick={card.onClick}
            className="text-left transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
          >
            <Card variant="elevated" className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${card.color}`}>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
      
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/messages')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Review Message Queue ({metrics.messagesReady + metrics.approved})
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/review')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Handle Manual Review ({metrics.manualReview})
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/followups')}
            >
              <Bell className="mr-2 h-4 w-4" />
              Check Follow-ups ({metrics.followUpsDue})
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Classification Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Relevant Contacts</span>
                  <span className="font-medium">{metrics.relevant} / {metrics.total}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div 
                    className="h-full rounded-full bg-green-500" 
                    style={{ width: `${metrics.total > 0 ? (metrics.relevant / metrics.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Messages Ready</span>
                  <span className="font-medium">{metrics.messagesReady + metrics.approved} / {metrics.relevant}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div 
                    className="h-full rounded-full bg-blue-500" 
                    style={{ width: `${metrics.relevant > 0 ? ((metrics.messagesReady + metrics.approved) / metrics.relevant) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contacted</span>
                  <span className="font-medium">{metrics.contacted} / {metrics.relevant}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div 
                    className="h-full rounded-full bg-indigo-500" 
                    style={{ width: `${metrics.relevant > 0 ? (metrics.contacted / metrics.relevant) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;