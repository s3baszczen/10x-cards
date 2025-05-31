import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import ProposalItem from "./ProposalItem";
import type { FlashcardProposal } from "./hooks/useGeneratorState";

interface ProposalListProps {
  proposals: FlashcardProposal[];
  onProposalAction: (id: string, action: "accept" | "reject" | "edit", updatedProposal?: FlashcardProposal) => void;
  onSaveAccepted: () => void;
  isSaving: boolean;
}

const ProposalList: React.FC<ProposalListProps> = ({ proposals, onProposalAction, onSaveAccepted, isSaving }) => {
  // Calculate stats for the proposal list
  const stats = useMemo(() => {
    const total = proposals.length;
    const accepted = proposals.filter((p) => p.status === "accepted").length;
    const rejected = proposals.filter((p) => p.status === "rejected").length;
    const pending = total - accepted - rejected;
    const hasAccepted = accepted > 0;

    return { total, accepted, rejected, pending, hasAccepted };
  }, [proposals]);

  // Handle action for a specific proposal
  const handleProposalAction = (
    id: string,
    action: "accept" | "reject" | "edit",
    updatedProposal?: FlashcardProposal
  ) => {
    onProposalAction(id, action, updatedProposal);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">Total: {stats.total}</div>
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
            Accepted: {stats.accepted}
          </div>
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm">
            Rejected: {stats.rejected}
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
            Pending: {stats.pending}
          </div>
        </div>

        <Button onClick={onSaveAccepted} disabled={!stats.hasAccepted || isSaving} className="min-w-[150px]">
          {isSaving ? "Saving..." : "Save Accepted"}
        </Button>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No flashcard proposals available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <ProposalItem
              key={proposal.id}
              proposal={proposal}
              onAction={(action, updatedProposal) => handleProposalAction(proposal.id, action, updatedProposal)}
            />
          ))}
        </div>
      )}

      {stats.hasAccepted && (
        <div className="flex justify-center mt-6">
          <Button onClick={onSaveAccepted} disabled={isSaving} size="lg" className="min-w-[200px]">
            {isSaving ? "Saving..." : `Save ${stats.accepted} Accepted Flashcards`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProposalList;
