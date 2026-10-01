import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import ClassificationTestPanel from '../components/testing/ClassificationTestPanel';
import { ArrowLeft, Beaker } from 'lucide-react';

const TestClassificationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/settings')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Settings
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Beaker className="mr-2 h-6 w-6" />
              Classification Engine Test
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Test and verify the accuracy of the classification engine
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/contacts/add')}
          >
            Back to Add Contact
          </Button>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-medium text-blue-900">About This Test</h3>
        <p className="mt-1 text-sm text-blue-800">
          This page allows you to test the classification engine with different profile scenarios.
          Use the test cases or create custom profiles to verify that:
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm text-blue-800">
          <li>Relevant finance/HR roles are correctly identified</li>
          <li>Non-relevant roles are filtered out</li>
          <li>Categories are assigned correctly (1, 2, 3, or Manual Review)</li>
          <li>Messages are generated following template rules</li>
          <li>Validation catches prohibited phrases and incorrect claims</li>
        </ul>
      </div>

      <ClassificationTestPanel />
      
      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900">Expected Test Results</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900">Category 1 (Junior/Associate)</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Accounts Payable Associate → Relevant, CAT_1, HIGH confidence</li>
              <li>• AR Executive → Relevant, CAT_1, HIGH confidence</li>
              <li>• P2P Analyst → Relevant, CAT_1, HIGH confidence</li>
              <li>• Finance Analyst → Relevant, CAT_1, MEDIUM confidence</li>
            </ul>
          </div>
          
          <div className="rounded-md border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900">Category 2 (Senior/Leadership)</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Finance Manager → Relevant, CAT_2, HIGH confidence</li>
              <li>• AP Team Lead → Relevant, CAT_2, HIGH confidence</li>
              <li>• R2R Supervisor → Relevant, CAT_2, HIGH confidence</li>
              <li>• Senior Manager – Finance → Relevant, CAT_2, HIGH confidence</li>
            </ul>
          </div>
          
          <div className="rounded-md border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900">Category 3 (HR/Recruiting)</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• HRBP → Relevant, CAT_3, HIGH confidence</li>
              <li>• Talent Acquisition → Relevant, CAT_3, HIGH confidence</li>
              <li>• Hiring Manager → Relevant, CAT_3, HIGH confidence</li>
              <li>• Campus Recruiter → Relevant, CAT_3, HIGH confidence</li>
            </ul>
          </div>
          
          <div className="rounded-md border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900">Manual Review / Not Relevant</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Senior Associate → Manual Review, LOW confidence</li>
              <li>• Operations Manager → Possibly Manual Review</li>
              <li>• Software Engineer → Not Relevant, HIGH confidence</li>
              <li>• Marketing Manager → Not Relevant, HIGH confidence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestClassificationPage;