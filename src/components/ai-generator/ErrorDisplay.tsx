import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ErrorLogResponseDTO } from '@/types';

interface ErrorDisplayProps {
  error: Error | ErrorLogResponseDTO;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  // Extract error message
  const errorMessage = error?.message || 'Wystąpił nieznany błąd podczas generowania fiszek.';
  
  // Get more detailed error info if available
  const detailedInfo = error?.details || error?.cause || null;
  
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTitle className="font-semibold">Błąd generowania</AlertTitle>
        <AlertDescription>
          <p className="mt-1">{errorMessage}</p>
          
          {detailedInfo && (
            <div className="mt-3 p-2 bg-red-50 dark:bg-red-950 rounded-md text-sm font-mono overflow-x-auto">
              {typeof detailedInfo === 'string' 
                ? detailedInfo
                : JSON.stringify(detailedInfo, null, 2)}
            </div>
          )}
          
          <div className="mt-4">
            <Button onClick={onRetry} variant="secondary">
              Spróbuj ponownie
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p>Możliwe przyczyny błędu:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Tekst źródłowy może zawierać treści nieodpowiednie dla AI</li>
          <li>Problem z połączeniem do serwisu AI</li>
          <li>Serwis AI może być chwilowo niedostępny</li>
          <li>Limity użycia serwisu AI mogły zostać przekroczone</li>
        </ul>
        <p className="mt-2">
          Jeśli problem będzie się powtarzał, spróbuj skrócić tekst źródłowy lub skontaktuj się z administratorem.
        </p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
