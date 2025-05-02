import React from 'react';
import { Button } from "@/components/ui/button";
import { FlashcardResponseDTO } from '../../types';
import FlashcardProposal from './FlashcardProposal';

// ProposalState type defined in AIGeneratorContainer
interface ProposalState {
  [flashcardId: string]: {
    status: 'pending' | 'accepted' | 'rejected' | 'editing';
    editedFrontText?: string;
    editedBackText?: string;
  }
}

interface FlashcardProposalListProps {
  proposals: FlashcardResponseDTO[];
  proposalStates: ProposalState;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onProposalStateChange: (id: string, status: 'pending' | 'accepted' | 'rejected' | 'editing', frontText?: string, backText?: string) => void;
}

const FlashcardProposalList: React.FC<FlashcardProposalListProps> = ({
  proposals,
  proposalStates,
  onAcceptAll,
  onRejectAll,
  onProposalStateChange
}) => {
  const handleAccept = (id: string) => {
    onProposalStateChange(id, 'accepted');
  };

  const handleReject = (id: string) => {
    onProposalStateChange(id, 'rejected');
  };

  const handleEdit = (id: string) => {
    onProposalStateChange(id, 'editing');
  };

  const handleSaveEdit = (id: string, frontText: string, backText: string) => {
    onProposalStateChange(id, 'pending', frontText, backText);
  };

  // Calculate stats
  const totalProposals = proposals.length;
  const acceptedCount = Object.values(proposalStates).filter(state => state.status === 'accepted').length;
  const rejectedCount = Object.values(proposalStates).filter(state => state.status === 'rejected').length;
  const pendingCount = totalProposals - acceptedCount - rejectedCount;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Wygenerowane propozycje fiszek
        </h3>
        
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
            Łącznie: {totalProposals}
          </span>
          {acceptedCount > 0 && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md">
              Zaakceptowane: {acceptedCount}
            </span>
          )}
          {rejectedCount > 0 && (
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-md">
              Odrzucone: {rejectedCount}
            </span>
          )}
          {pendingCount > 0 && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-md">
              Oczekujące: {pendingCount}
            </span>
          )}
        </div>
      </div>

      {/* Bulk actions */}
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={onAcceptAll}
          variant="outline"
          className="text-green-700 dark:text-green-500 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950"
        >
          Akceptuj wszystkie
        </Button>
        <Button 
          onClick={onRejectAll}
          variant="outline"
          className="text-red-700 dark:text-red-500 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
        >
          Odrzuć wszystkie
        </Button>
      </div>

      {/* Proposals list */}
      {proposals.length > 0 ? (
        <div className="space-y-4 mt-4">
          {proposals.map((proposal) => (
            <FlashcardProposal
              key={proposal.id}
              proposal={proposal}
              state={proposalStates[proposal.id]?.status || 'pending'}
              editedFrontText={proposalStates[proposal.id]?.editedFrontText}
              editedBackText={proposalStates[proposal.id]?.editedBackText}
              onAccept={handleAccept}
              onReject={handleReject}
              onEdit={handleEdit}
              onSaveEdit={handleSaveEdit}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Brak propozycji fiszek
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Wprowadź tekst źródłowy i kliknij "Generuj" aby utworzyć propozycje fiszek.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardProposalList;
