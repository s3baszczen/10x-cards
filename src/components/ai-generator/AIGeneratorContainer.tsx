import React, { useState } from 'react';
import { VALIDATION_CONSTANTS, type GenerateFlashcardsCommand, type GenerateFlashcardsResponseDTO, type FlashcardResponseDTO } from '../../types';
import SourceTextInput from './SourceTextInput';
import GeneratorControls from './GeneratorControls';
import ProgressIndicator from './ProgressIndicator';
import FlashcardProposalList from './FlashcardProposalList';
import ErrorDisplay from './ErrorDisplay';

type FlashcardProposalState = Record<string, 'pending' | 'accepted' | 'rejected'>;

type GeneratorState =
  | { status: 'idle' }
  | { status: 'generating' }
  | { status: 'loading' }
  | { status: 'completed', data: GenerateFlashcardsResponseDTO }
  | { status: 'error', error: string };

interface AIGeneratorContainerProps {
  /** Określa, czy komponent jest wyświetlany w modalu (true) czy jako strona (false) */
  isModal?: boolean;
  /** Funkcja wywoływana po zamknięciu modalu */
  onClose?: () => void;
  /** Funkcja wywoływana po zaakceptowaniu wygenerowanych fiszek */
  onFlashcardsGenerated?: (flashcards: FlashcardResponseDTO[]) => void;
}

const AIGeneratorContainer: React.FC<AIGeneratorContainerProps> = ({
  isModal = false,
  onClose,
  onFlashcardsGenerated
}) => {
  const [sourceText, setSourceText] = useState('');
  const [generatorState, setGeneratorState] = useState<GeneratorState>({ status: 'idle' });
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const [flashcardProposalStates, setFlashcardProposalStates] = useState<FlashcardProposalState>({});

  const handleSourceTextChange = (text: string) => {
    setSourceText(text);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const resetGenerator = () => {
    setGeneratorState({ status: 'idle' });
    setFlashcardProposalStates({});
  };

  const handleCancelGeneration = () => {
    resetGenerator();
    if (isModal && onClose) {
      onClose();
    }
  };

  const handleGenerateFlashcards = async () => {
    try {
      setGeneratorState({ status: 'generating' });

      // Symulacja opóźnienia dla UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      setGeneratorState({ status: 'loading' });

      const command: GenerateFlashcardsCommand = {
        source_text: sourceText,
        model: selectedModel,
      };

      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        let errorData = { message: 'Unknown error' };
        try {
          errorData = await response.json();
        } catch (e) {
          // Ignoruj błąd parsowania JSON
        }
        throw new Error(errorData.message || 'Failed to generate flashcards');
      }

      const data: GenerateFlashcardsResponseDTO = await response.json();

      // Initialize proposal states for all generated flashcards
      const initialProposalStates: FlashcardProposalState = {};
      data.flashcards.forEach(flashcard => {
        initialProposalStates[flashcard.id] = 'pending';
      });

      setFlashcardProposalStates(initialProposalStates);
      setGeneratorState({ status: 'completed', data });
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setGeneratorState({
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  const handleFlashcardProposalStateChange = (id: string, state: 'pending' | 'accepted' | 'rejected') => {
    setFlashcardProposalStates(prev => ({
      ...prev,
      [id]: state,
    }));
  };

  const handleAcceptAll = () => {
    const newStates = { ...flashcardProposalStates };
    generatorState.status === 'completed' && generatorState.data.flashcards.forEach(flashcard => {
      newStates[flashcard.id] = 'accepted';
    });
    setFlashcardProposalStates(newStates);
    
    // Powiadamianie rodzica o zaakceptowanych fiszkach
    if (onFlashcardsGenerated && generatorState.status === 'completed') {
      const acceptedFlashcards = generatorState.data.flashcards.filter(
        flashcard => newStates[flashcard.id] === 'accepted'
      );
      onFlashcardsGenerated(acceptedFlashcards);
    }
  };

  const handleRejectAll = () => {
    const newStates = { ...flashcardProposalStates };
    generatorState.status === 'completed' && generatorState.data.flashcards.forEach(flashcard => {
      newStates[flashcard.id] = 'rejected';
    });
    setFlashcardProposalStates(newStates);
  };

  const handleSaveAccepted = () => {
    if (generatorState.status !== 'completed') return;
    
    const acceptedFlashcards = generatorState.data.flashcards.filter(
      flashcard => flashcardProposalStates[flashcard.id] === 'accepted'
    );
    
    // Informujemy rodzica o zaakceptowanych fiszkach
    if (onFlashcardsGenerated) {
      onFlashcardsGenerated(acceptedFlashcards);
    }
    
    // Resetujemy stan po zapisie i zamykamy modal jeśli potrzeba
    resetGenerator();
    if (isModal && onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-8">
      {generatorState.status === 'idle' && (
        <>
          <div className="space-y-4">
            <SourceTextInput
              value={sourceText}
              onChange={handleSourceTextChange}
              minLength={VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH}
              maxLength={VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH}
            />
          </div>
          <GeneratorControls
            onGenerate={handleGenerateFlashcards}
            onCancel={handleCancelGeneration}
            onModelChange={handleModelChange}
            selectedModel={selectedModel}
            isGenerateDisabled={sourceText.length < VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH}
            isCancelButtonVisible={isModal}
          />
        </>
      )}

      {(generatorState.status === 'generating' || generatorState.status === 'loading') && (
        <ProgressIndicator status={generatorState.status} />
      )}

      {generatorState.status === 'error' && (
        <ErrorDisplay
          error={generatorState.error}
          onRetry={handleGenerateFlashcards}
          onCancel={resetGenerator}
        />
      )}

      {generatorState.status === 'completed' && (
        <>
          <FlashcardProposalList
            proposals={generatorState.data.flashcards}
            proposalStates={flashcardProposalStates}
            onProposalStateChange={handleFlashcardProposalStateChange}
            onAcceptAll={handleAcceptAll}
            onRejectAll={handleRejectAll}
            onSave={handleSaveAccepted}
            onCancel={resetGenerator}
          />
        </>
      )}
    </div>
  );
};

export default AIGeneratorContainer;
