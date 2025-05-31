import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GenerationStatusProps {
  isGenerating: boolean;
  progress?: number;
  statusMessage?: string;
}

const GenerationStatus: React.FC<GenerationStatusProps> = ({
  isGenerating,
  progress = 0,
  statusMessage = 'Generating flashcards...'
}) => {
  // Use indeterminate progress when no specific progress value is available
  const showIndeterminateProgress = isGenerating && progress === 0;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin mr-3 h-5 w-5 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-lg font-medium">{statusMessage}</p>
          </div>
          
          <div className="w-full">
            <Progress 
              value={showIndeterminateProgress ? undefined : progress} 
              max={100}
              className={showIndeterminateProgress ? "animate-pulse" : ""}
              aria-label="Generation progress"
            />
          </div>
          
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            This may take up to a minute depending on the length of your text.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerationStatus;
