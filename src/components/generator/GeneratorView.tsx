import React from "react";
import { useGeneratorState } from "./hooks/useGeneratorState";
import TextInputSection from "./TextInputSection";
import GenerationStatus from "./GenerationStatus";
import ProposalList from "./ProposalList";

interface GeneratorViewProps {
  isModal?: boolean;
}

const GeneratorView: React.FC<GeneratorViewProps> = ({ isModal = false }) => {
  const { state, setSourceText, startGeneration, handleProposalAction, saveAcceptedFlashcards } = useGeneratorState();

  return (
    <div className={`flex flex-col gap-6 ${isModal ? "p-4" : ""}`}>
      {state.step === "input" && (
        <TextInputSection
          sourceText={state.sourceText}
          onSourceTextChange={setSourceText}
          onGenerateClick={startGeneration}
          isGenerating={state.isGenerating}
          validationError={state.validationError}
        />
      )}

      {state.step === "generating" && (
        <GenerationStatus
          isGenerating={state.isGenerating}
          statusMessage="Generating flashcards... This may take a moment."
        />
      )}

      {state.step === "review" && (
        <>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Review Generated Flashcards</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Review the generated flashcards below. You can accept, reject, or edit each one.
            </p>
          </div>

          <ProposalList
            proposals={state.proposals}
            onProposalAction={handleProposalAction}
            onSaveAccepted={saveAcceptedFlashcards}
            isSaving={state.isSaving}
          />
        </>
      )}

      {state.error && (
        <div
          className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}
    </div>
  );
};

export default GeneratorView;
