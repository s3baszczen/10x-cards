import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProgressIndicatorProps {
  isVisible: boolean;
  status?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isVisible,
  status = "Generowanie fiszek w toku..."
}) => {
  if (!isVisible) return null;

  return (
    <div className="my-6 space-y-4">
      <Alert>
        <AlertDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <svg 
              className="animate-spin h-5 w-5 text-primary" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="font-medium">{status}</span>
          </div>
          <Progress className="h-2" value={undefined} />
          <p className="text-sm text-muted-foreground">
            Proces może zająć od kilku sekund do kilku minut, w zależności od długości tekstu.
            Nie zamykaj ani nie odświeżaj strony podczas generowania.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ProgressIndicator;
