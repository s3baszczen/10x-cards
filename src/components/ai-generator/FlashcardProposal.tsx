import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FlashcardResponseDTO } from '../../types';

interface FlashcardProposalProps {
  proposal: FlashcardResponseDTO;
  state: 'pending' | 'accepted' | 'rejected' | 'editing';
  editedFrontText?: string;
  editedBackText?: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string) => void;
  onSaveEdit: (id: string, frontText: string, backText: string) => void;
}

const FlashcardProposal: React.FC<FlashcardProposalProps> = ({
  proposal,
  state,
  editedFrontText,
  editedBackText,
  onAccept,
  onReject,
  onEdit,
  onSaveEdit
}) => {
  // Local state for editing
  const [frontText, setFrontText] = useState<string>(proposal.front_text);
  const [backText, setBackText] = useState<string>(proposal.back_text);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update local state when editing starts or when editedText changes
  useEffect(() => {
    if (state === 'editing') {
      setFrontText(editedFrontText || proposal.front_text);
      setBackText(editedBackText || proposal.back_text);
    }
  }, [state, proposal, editedFrontText, editedBackText]);

  const handleSaveEdit = () => {
    // Validate fields
    if (!frontText.trim()) {
      setValidationError('Pytanie nie może być puste');
      return;
    }

    if (!backText.trim()) {
      setValidationError('Odpowiedź nie może być pusta');
      return;
    }

    setValidationError(null);
    onSaveEdit(proposal.id, frontText, backText);
  };

  const handleCancelEdit = () => {
    // Reset to original text and exit editing mode
    setFrontText(proposal.front_text);
    setBackText(proposal.back_text);
    setValidationError(null);
    onAccept(proposal.id); // Use "accept" to exit editing mode
  };

  let cardBorderColor = "";
  if (state === 'accepted') {
    cardBorderColor = "border-green-500 dark:border-green-700";
  } else if (state === 'rejected') {
    cardBorderColor = "border-red-500 dark:border-red-700";
  } else if (state === 'editing') {
    cardBorderColor = "border-blue-500 dark:border-blue-700";
  }

  return (
    <Card className={`border ${cardBorderColor} transition-colors`}>
      <CardContent className="p-4">
        {state === 'editing' ? (
          // Edit mode
          <div className="space-y-4">
            <div>
              <label htmlFor={`front-text-${proposal.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Przód fiszki (pytanie)
              </label>
              <Textarea
                id={`front-text-${proposal.id}`}
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                className="w-full min-h-[80px]"
                placeholder="Wprowadź pytanie..."
              />
            </div>
            <div>
              <label htmlFor={`back-text-${proposal.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tył fiszki (odpowiedź)
              </label>
              <Textarea
                id={`back-text-${proposal.id}`}
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                className="w-full min-h-[80px]"
                placeholder="Wprowadź odpowiedź..."
              />
            </div>
            {validationError && (
              <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
            )}
          </div>
        ) : (
          // View mode
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Przód fiszki (pytanie)
              </h4>
              <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800 min-h-[80px]">
                {editedFrontText || proposal.front_text}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tył fiszki (odpowiedź)
              </h4>
              <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800 min-h-[80px]">
                {editedBackText || proposal.back_text}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        {state === 'editing' ? (
          // Edit mode actions
          <>
            <Button 
              onClick={handleSaveEdit}
              className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Zapisz zmiany
            </Button>
            <Button 
              onClick={handleCancelEdit}
              variant="outline"
            >
              Anuluj
            </Button>
          </>
        ) : (
          // View mode actions
          <>
            {state === 'pending' && (
              <>
                <Button 
                  onClick={() => onAccept(proposal.id)}
                  className="text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                >
                  Akceptuj
                </Button>
                <Button 
                  onClick={() => onEdit(proposal.id)}
                  variant="outline"
                  className="text-blue-700 dark:text-blue-400"
                >
                  Edytuj
                </Button>
                <Button 
                  onClick={() => onReject(proposal.id)}
                  variant="outline"
                  className="text-red-700 dark:text-red-400"
                >
                  Odrzuć
                </Button>
              </>
            )}
            {state === 'accepted' && (
              <>
                <span className="px-2 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md">
                  Zaakceptowano
                </span>
                <Button 
                  onClick={() => onEdit(proposal.id)}
                  variant="outline"
                  size="sm"
                  className="text-blue-700 dark:text-blue-400"
                >
                  Edytuj
                </Button>
                <Button 
                  onClick={() => onReject(proposal.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-700 dark:text-red-400"
                >
                  Odrzuć
                </Button>
              </>
            )}
            {state === 'rejected' && (
              <>
                <span className="px-2 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-md">
                  Odrzucono
                </span>
                <Button 
                  onClick={() => onAccept(proposal.id)}
                  variant="outline"
                  size="sm"
                  className="text-green-700 dark:text-green-400"
                >
                  Przywróć
                </Button>
              </>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default FlashcardProposal;
