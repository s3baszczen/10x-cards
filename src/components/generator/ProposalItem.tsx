import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckIcon, XIcon, PencilIcon } from "lucide-react";
import FlashcardPreview from "./FlashcardPreview";
import type { FlashcardProposal } from "./hooks/useGeneratorState";

interface ProposalItemProps {
  proposal: FlashcardProposal;
  onAction: (action: "accept" | "reject" | "edit", updatedProposal?: FlashcardProposal) => void;
}

const ProposalItem: React.FC<ProposalItemProps> = ({ proposal, onAction }) => {
  const [editedFrontText, setEditedFrontText] = useState(proposal.frontText);
  const [editedBackText, setEditedBackText] = useState(proposal.backText);
  const [hasValidationError, setHasValidationError] = useState(false);

  const handleEdit = (field: "front" | "back", value: string) => {
    if (field === "front") {
      setEditedFrontText(value);
    } else {
      setEditedBackText(value);
    }

    // Check if both fields have valid content
    const frontValid = editedFrontText.trim().length > 0;
    const backValid = editedBackText.trim().length > 0;
    setHasValidationError(!(frontValid && backValid));
  };

  const handleSaveEdit = () => {
    if (!hasValidationError) {
      const updatedProposal: FlashcardProposal = {
        ...proposal,
        frontText: editedFrontText,
        backText: editedBackText,
      };
      onAction("edit", updatedProposal);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values and exit edit mode
    setEditedFrontText(proposal.frontText);
    setEditedBackText(proposal.backText);
    setHasValidationError(false);
    onAction("edit");
  };

  return (
    <Card
      className={`border-l-4 ${
        proposal.status === "accepted"
          ? "border-l-green-500"
          : proposal.status === "rejected"
            ? "border-l-red-500"
            : "border-l-gray-300 dark:border-l-gray-600"
      }`}
    >
      <CardContent className="pt-6">
        <FlashcardPreview
          frontText={proposal.isEditing ? editedFrontText : proposal.frontText}
          backText={proposal.isEditing ? editedBackText : proposal.backText}
          isEditable={proposal.isEditing}
          onEdit={handleEdit}
        />
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {proposal.isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={hasValidationError}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            {proposal.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onAction("reject")}
                  aria-label="Reject flashcard"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <XIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onAction("edit")}
                  aria-label="Edit flashcard"
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onAction("accept")}
                  aria-label="Accept flashcard"
                  className="text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                >
                  <CheckIcon className="h-4 w-4" />
                </Button>
              </>
            )}

            {proposal.status === "accepted" && (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center">
                <CheckIcon className="h-4 w-4 mr-1" /> Accepted
              </span>
            )}

            {proposal.status === "rejected" && (
              <span className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center">
                <XIcon className="h-4 w-4 mr-1" /> Rejected
              </span>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProposalItem;
