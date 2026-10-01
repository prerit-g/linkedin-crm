import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { CategoryBadge } from '../ui/CategoryBadge';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import { StatusPill } from '../ui/StatusPill';
import { Play, AlertCircle, CheckCircle } from 'lucide-react';
import { classifyProfile, generateMessage } from '../../engine';
import { validateMessage } from '../../engine/messageGeneration';
import { ProfileInput } from '../../types/contact';

const ClassificationTestPanel: React.FC = () => {
  const [testProfile, setTestProfile] = useState<ProfileInput>({
    linkedInUrl: 'https://linkedin.com/in/test',
    firstName: 'John',
    lastName: 'Doe',
    currentJobTitle: 'Accounts Payable Associate',
    company: 'Test Company',
    headline: 'AP Associate focused on process improvement',
    about: 'Handling accounts payable operations and vendor management.',
    location: 'New York, NY',
    userNotes: '',
  });
  
  const [classificationResult, setClassificationResult] = useState<any>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const runTest = () => {
    setIsTesting(true);
    
    setTimeout(() => {
      try {
        // Run classification
        const classification = classifyProfile(testProfile);
        setClassificationResult(classification);
        
        // Generate message
        const message = generateMessage(testProfile, classification);
        setGeneratedMessage(message);
        
        // Validate message
        const validation = validateMessage(message, testProfile, classification);
        setValidationResult(validation);
      } catch (error) {
        console.error('Test error:', error);
        setClassificationResult({ error: String(error) });
      } finally {
        setIsTesting(false);
      }
    }, 100);
  };

  const handleFieldChange = (field: keyof ProfileInput, value: string) => {
    setTestProfile(prev => ({ ...prev, [field]: value }));
  };

  const testCases = [
    {
      title: 'AP Associate (Category 1)',
      profile: {
        currentJobTitle: 'Accounts Payable Associate',
        headline: 'AP Associate | Process Improvement',
        about: 'Junior AP role focusing on vendor payments',
      },
    },
    {
      title: 'Finance Manager (Category 2)',
      profile: {
        currentJobTitle: 'Finance Manager',
        headline: 'Finance Manager | FP&A | Budgeting',
        about: 'Leading finance team with 5+ years experience',
      },
    },
    {
      title: 'HRBP (Category 3)',
      profile: {
        currentJobTitle: 'HR Business Partner',
        headline: 'HRBP | Talent Acquisition | Employee Relations',
        about: 'HR Business Partner supporting finance division',
      },
    },
    {
      title: 'Senior Associate (Manual Review)',
      profile: {
        currentJobTitle: 'Senior Associate - Finance',
        headline: 'Senior Finance Associate',
        about: 'Senior individual contributor in finance',
      },
    },
    {
      title: 'Software Engineer (Not Relevant)',
      profile: {
        currentJobTitle: 'Software Engineer',
        headline: 'Full Stack Developer | React | Node.js',
        about: 'Building web applications and APIs',
      },
    },
  ];

  const loadTestCase = (testCase: typeof testCases[0]) => {
    setTestProfile(prev => ({
      ...prev,
      currentJobTitle: testCase.profile.currentJobTitle,
      headline: testCase.profile.headline,
      about: testCase.profile.about,
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="mr-2 h-5 w-5" />
            Classification Engine Test Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Test the classification engine with different profile scenarios
            </p>
          </div>
          
          <div className="grid gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {testCases.map((testCase, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadTestCase(testCase)}
                  disabled={isTesting}
                >
                  {testCase.title}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Job Title"
              value={testProfile.currentJobTitle}
              onChange={(e) => handleFieldChange('currentJobTitle', e.target.value)}
              disabled={isTesting}
              placeholder="e.g., Accounts Payable Associate"
            />
            <Input
              label="Company"
              value={testProfile.company}
              onChange={(e) => handleFieldChange('company', e.target.value)}
              disabled={isTesting}
              placeholder="e.g., TechCorp Inc."
            />
            <Input
              label="First Name"
              value={testProfile.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              disabled={isTesting}
              placeholder="e.g., John"
            />
            <Input
              label="Last Name"
              value={testProfile.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              disabled={isTesting}
              placeholder="e.g., Doe"
            />
          </div>
          
          <Textarea
            label="Headline"
            value={testProfile.headline}
            onChange={(e) => handleFieldChange('headline', e.target.value)}
            disabled={isTesting}
            rows={2}
            className="mt-4"
            placeholder="e.g., AP Associate | Process Improvement | Vendor Management"
          />
          
          <Textarea
            label="About Section"
            value={testProfile.about}
            onChange={(e) => handleFieldChange('about', e.target.value)}
            disabled={isTesting}
            rows={3}
            className="mt-4"
            placeholder="e.g., Handling accounts payable operations with focus on automation..."
          />
          
          <Button
            onClick={runTest}
            isLoading={isTesting}
            className="mt-6 w-full"
            variant="primary"
          >
            {isTesting ? 'Testing...' : 'Run Classification Test'}
          </Button>
        </CardContent>
      </Card>
      
      {classificationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Classification Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classificationResult.error ? (
              <div className="rounded-md bg-red-50 p-4 text-red-800">
                <p className="font-medium">Error</p>
                <p className="mt-1">{classificationResult.error}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Relevance</p>
                    <div className="mt-1">
                      {classificationResult.isRelevant ? (
                        <Badge variant="primary">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Relevant
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Not Relevant
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Function</p>
                    <div className="mt-1">
                      <Badge variant="secondary">
                        {classificationResult.function?.replace('_', ' ') || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Category</p>
                    <div className="mt-1">
                      <CategoryBadge category={classificationResult.category} />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Confidence</p>
                    <div className="mt-1">
                      <ConfidenceBadge confidence={classificationResult.confidence} />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Seniority</p>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {classificationResult.seniority || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <div className="mt-1">
                      {classificationResult.needsManualReview ? (
                        <StatusPill status="REVIEW_REQUIRED" />
                      ) : classificationResult.isRelevant ? (
                        <StatusPill status="MESSAGE_READY" />
                      ) : (
                        <StatusPill status="NOT_RELEVANT" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Classification Reason</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {classificationResult.classificationReason}
                  </p>
                </div>
                
                {classificationResult.needsManualReview && classificationResult.manualReviewReason && (
                  <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                    <p className="font-medium">Manual Review Needed</p>
                    <p className="mt-1">{classificationResult.manualReviewReason}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Generated Message</p>
                  <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {generatedMessage}
                    </pre>
                  </div>
                </div>
                
                {validationResult && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Message Validation</p>
                    <div className={`mt-2 rounded-md p-3 text-sm ${
                      validationResult.isValid 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-red-50 text-red-800'
                    }`}>
                      <p className="font-medium">
                        {validationResult.isValid ? '✅ Message is valid' : '❌ Message has issues'}
                      </p>
                      {validationResult.errors?.length > 0 && (
                        <ul className="mt-1 list-disc pl-5">
                          {validationResult.errors.map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900">Test Guidelines</h3>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          <li>• Use test cases or create custom profiles to test classification</li>
          <li>• Check that relevant finance/HR roles are correctly identified</li>
          <li>• Verify non-relevant roles (engineering, marketing) are filtered out</li>
          <li>• Test edge cases like "Senior Associate" (should go to manual review)</li>
          <li>• Validate generated messages follow template rules</li>
          <li>• Check that prohibited phrases are caught by validation</li>
        </ul>
      </div>
    </div>
  );
};

export default ClassificationTestPanel;