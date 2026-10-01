import React from 'react';
import { ProfileInput } from '../../types/contact';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StatusPill } from '../ui/StatusPill';
import { CategoryBadge } from '../ui/CategoryBadge';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { quickClassifyTitle } from '../../engine/classification';

export interface ClassificationPreviewProps {
  profile: ProfileInput;
  isLoading?: boolean;
}

const ClassificationPreview: React.FC<ClassificationPreviewProps> = ({
  profile,
  isLoading = false,
}) => {
  // Run quick classification on title
  const classification = quickClassifyTitle(profile.currentJobTitle);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classification Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Analyzing job title...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile.currentJobTitle.trim()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classification Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">Enter a job title to see classification preview</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const isRelevant = classification.isRelevant ?? true;
  const needsManualReview = classification.needsManualReview ?? false;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Classification Preview</span>
          {isRelevant ? (
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Job Title Analysis</p>
          <p className="text-sm text-gray-900 mt-1">{profile.currentJobTitle}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Function</p>
            <div className="mt-1">
              {classification.function && classification.function !== 'UNKNOWN' ? (
                <Badge variant="secondary">{classification.function.replace('_', ' ')}</Badge>
              ) : (
                <span className="text-sm text-gray-500">Unknown</span>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Category</p>
            <div className="mt-1">
              {classification.category && classification.category !== 'MANUAL_REVIEW' ? (
                <CategoryBadge category={classification.category} size="sm" />
              ) : (
                <Badge variant="outline" size="sm">Manual Review</Badge>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Confidence</p>
            <div className="mt-1">
              {classification.confidence ? (
                <ConfidenceBadge confidence={classification.confidence} size="sm" />
              ) : (
                <span className="text-sm text-gray-500">Unknown</span>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Status</p>
            <div className="mt-1">
              {needsManualReview ? (
                <StatusPill status="REVIEW_REQUIRED" size="sm" />
              ) : isRelevant ? (
                <StatusPill status="MESSAGE_READY" size="sm" />
              ) : (
                <StatusPill status="NOT_RELEVANT" size="sm" />
              )}
            </div>
          </div>
        </div>
        
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          <p className="font-medium">Note</p>
          <p className="mt-1">
            This is a preview based on job title only. Full classification will analyze the entire profile
            including headline and about section after submission.
          </p>
        </div>
        
        {needsManualReview && (
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            <p className="font-medium">Manual Review Likely</p>
            <p className="mt-1">
              This profile may require manual review due to ambiguous title or low confidence classification.
            </p>
          </div>
        )}
        
        {!isRelevant && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            <p className="font-medium">Not Relevant for Outreach</p>
            <p className="mt-1">
              This role appears to be outside target functions (accounting, finance operations, HR).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassificationPreview;