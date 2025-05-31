import { useState, useCallback } from "react";
import { VALIDATION_CONSTANTS } from "@/types";
import type { GenerateFlashcardsCommand } from "@/types";

// Define types for the generator state
export interface GeneratorViewState {
  step: "input" | "generating" | "review";
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
  status: "pending" | "accepted" | "rejected";
  isEditing?: boolean;
}

// Mapping proposals to DTO for saving
export interface FlashcardToSave {
  front_text: string;
  back_text: string;
}

export function useGeneratorState() {
  const [state, setState] = useState<GeneratorViewState>({
    step: "input",
    sourceText: "",
    proposals: [],
    isGenerating: false,
    isSaving: false,
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

    setState({
      ...state,
      sourceText: text,
      validationError,
    });
  }, []);

  // Start generation process
  const startGeneration = useCallback(async () => {
    // Validate text length
    if (state.sourceText.length < VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH) {
      setState({
        ...state,
        validationError: `Text must be at least ${VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} characters long`,
      });
      return;
    }

    if (state.sourceText.length > VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH) {
      setState({
        ...state,
        validationError: `Text must not exceed ${VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH} characters`,
      });
      return;
    }

    // Clear any previous errors and set generating state
    setState({
      ...state,
      step: "generating",
      isGenerating: true,
      error: undefined,
    });

    try {
      // Prepare request payload
      const payload: GenerateFlashcardsCommand = {
        source_text: state.sourceText,
      };

      console.log("Sending generation request with payload:", payload);

      // Call API to generate flashcards
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error response from API:", data);
        throw new Error(data.error?.message || data.error || "Failed to generate flashcards");
      }

      console.log("Received generation response:", data);

      // Map API response to proposal format
      const proposals: FlashcardProposal[] = data.flashcards.map(
        (card: { front_text: string; back_text: string }, index: number) => {
          return {
            id: String(index), // Generate temporary IDs since we don't have real ones yet
            frontText: card.front_text,
            backText: card.back_text,
            status: "pending",
          };
        }
      );

      // Update state with generation results
      setState({
        ...state,
        step: "review",
        isGenerating: false,
        generationId: data.generation_id,
        proposals,
      });
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setState({
        ...state,
        step: "input",
        isGenerating: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  }, [state.sourceText]);

  // Handle proposal actions (accept/reject/edit)
  const handleProposalAction = useCallback(
    (id: string, action: "accept" | "reject" | "edit", updatedProposal?: FlashcardProposal) => {
      setState((prev) => {
        const updatedProposals = prev.proposals.map((proposal) => {
          if (proposal.id === id) {
            if (action === "accept") {
              return { ...proposal, status: "accepted" as const, isEditing: false };
            } else if (action === "reject") {
              return { ...proposal, status: "rejected" as const, isEditing: false };
            } else if (action === "edit" && !updatedProposal) {
              // Toggle editing mode
              return { ...proposal, isEditing: !proposal.isEditing };
            } else if (action === "edit" && updatedProposal) {
              // Apply edits
              return {
                ...proposal,
                frontText: updatedProposal.frontText,
                backText: updatedProposal.backText,
                status: "accepted" as const, // Auto-accept edited cards
                isEditing: false,
              };
            }
          }
          return proposal;
        });

        return {
          ...prev,
          proposals: updatedProposals,
        };
      });
    },
    []
  );

  // Save accepted flashcards
  const saveAcceptedFlashcards = useCallback(async () => {
    if (!state.generationId) {
      console.error("Missing generation ID");
      setState({
        ...state,
        error: "Missing generation ID",
      });
      return;
    }

    const acceptedProposals = state.proposals.filter((p) => p.status === "accepted");
    console.log("Accepted proposals:", acceptedProposals);

    if (acceptedProposals.length === 0) {
      console.error("No accepted flashcards to save");
      setState({
        ...state,
        error: "Please accept at least one flashcard before saving",
      });
      return;
    }

    setState({
      ...state,
      isSaving: true,
      error: undefined,
    });

    try {
      // Transform accepted proposals to DTO format
      const flashcardsToSave: FlashcardToSave[] = acceptedProposals.map((p) => ({
        front_text: p.frontText,
        back_text: p.backText,
      }));

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generation_id: state.generationId,
          flashcards: flashcardsToSave,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save flashcards");
      }

      // Reset state after successful save
      setState({
        step: "input",
        sourceText: "",
        proposals: [],
        isGenerating: false,
        isSaving: false,
      });

      return true;
    } catch (error: unknown) {
      console.error("Error saving flashcards:", error);
      setState({
        ...state,
        isSaving: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      return false;
    }
  }, [state.proposals, state.generationId]);

  return {
    state,
    setSourceText,
    startGeneration,
    handleProposalAction,
    saveAcceptedFlashcards,
  };
}
