import { useState, useCallback } from 'react';
import { VALIDATION_CONSTANTS } from '@/types';
import type { GenerateFlashcardsCommand, GenerateFlashcardsResponseDTO } from '@/types';

// Define types for the generator state
export interface GeneratorViewState {
  step: 'input' | 'generating' | 'review';
  sourceText: string;
  validationError?: string;
  generationId?: string;
  proposals: FlashcardProposal[];
  isGenerating: boolean;
  isSaving: boolean;
  error?: string;
}

// Model for flashcard proposal
export interface FlashcardProposal {
  id: string;
  frontText: string;
  backText: string;
  status: 'pending' | 'accepted' | 'rejected';
  isEditing?: boolean;
}

// Mapping proposals to DTO for saving
export interface FlashcardToSave {
  front_text: string;
  back_text: string;
  creation: 'ai' | 'ai-edited';
  generation_id: string;
}

export function useGeneratorState() {
  const [state, setState] = useState<GeneratorViewState>({
    step: 'input',
    sourceText: '',
    proposals: [],
    isGenerating: false,
    isSaving: false
  });

  // Update source text and validate
  const setSourceText = useCallback((text: string) => {
    const characterCount = text.length;
    let validationError: string | undefined;

    if (characterCount > 0) {
      if (characterCount < VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH) {
        validationError = `Text must be at least ${VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} characters long`;
      } else if (characterCount > VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH) {
        validationError = `Text must not exceed ${VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH} characters`;
      }
    }

    setState(prev => ({
      ...prev,
      sourceText: text,
      validationError
    }));
  }, []);

  // Start generation process
  const startGeneration = useCallback(async () => {
    // Validate text length
    if (state.sourceText.length < VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH) {
      setState(prev => ({
        ...prev,
        validationError: `Text must be at least ${VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} characters long`
      }));
      return;
    }

    if (state.sourceText.length > VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH) {
      setState(prev => ({
        ...prev,
        validationError: `Text must not exceed ${VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH} characters`
      }));
      return;
    }

    // Clear any previous errors and set generating state
    setState(prev => ({
      ...prev,
      step: 'generating',
      isGenerating: true,
      error: undefined
    }));

    try {
      // Prepare request payload
      const payload: GenerateFlashcardsCommand = {
        source_text: state.sourceText
      };

      // Call API to generate flashcards
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate flashcards');
      }

      // Parse response
      const data: GenerateFlashcardsResponseDTO = await response.json();

      // Map API response to proposal format
      const proposals: FlashcardProposal[] = data.flashcards.map(card => ({
        id: card.id,
        frontText: card.front_text,
        backText: card.back_text,
        status: 'pending'
      }));

      // Update state with generation results
      setState(prev => ({
        ...prev,
        step: 'review',
        isGenerating: false,
        generationId: data.generation_id,
        proposals
      }));
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setState(prev => ({
        ...prev,
        step: 'input',
        isGenerating: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
    }
  }, [state.sourceText]);

  // Handle proposal actions (accept/reject/edit)
  const handleProposalAction = useCallback((
    id: string, 
    action: 'accept' | 'reject' | 'edit', 
    updatedProposal?: FlashcardProposal
  ) => {
    setState(prev => {
      const updatedProposals = prev.proposals.map(proposal => {
        if (proposal.id === id) {
          if (action === 'accept') {
            return { ...proposal, status: 'accepted' as const, isEditing: false };
          } else if (action === 'reject') {
            return { ...proposal, status: 'rejected' as const, isEditing: false };
          } else if (action === 'edit' && !updatedProposal) {
            // Toggle editing mode
            return { ...proposal, isEditing: !proposal.isEditing };
          } else if (action === 'edit' && updatedProposal) {
            // Apply edits
            return { 
              ...proposal, 
              frontText: updatedProposal.frontText,
              backText: updatedProposal.backText,
              status: 'accepted' as const, // Auto-accept edited cards
              isEditing: false
            };
          }
        }
        return proposal;
      });

      return {
        ...prev,
        proposals: updatedProposals
      };
    });
  }, []);

  // Save accepted flashcards
  const saveAcceptedFlashcards = useCallback(async () => {
    if (!state.generationId) {
      setState(prev => ({
        ...prev,
        error: 'Missing generation ID'
      }));
      return;
    }

    const acceptedProposals = state.proposals.filter(p => p.status === 'accepted');
    
    if (acceptedProposals.length === 0) {
      setState(prev => ({
        ...prev,
        error: 'Please accept at least one flashcard before saving'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isSaving: true,
      error: undefined
    }));

    try {
      // Map accepted proposals to DTO format
      const flashcardsToSave = acceptedProposals.map(proposal => ({
        front_text: proposal.frontText,
        back_text: proposal.backText,
        creation: proposal.isEditing ? 'ai-edited' : 'ai',
        generation_id: state.generationId!
      }));

      // Call API to save flashcards
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          source_text: state.sourceText,
          flashcards: flashcardsToSave 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to save flashcards');
      }

      // Redirect to flashcards page after successful save
      window.location.href = '/flashcards';
    } catch (error) {
      console.error('Error saving flashcards:', error);
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred while saving'
      }));
    }
  }, [state.proposals, state.generationId]);

  return {
    state,
    setSourceText,
    startGeneration,
    handleProposalAction,
    saveAcceptedFlashcards
  };
}
