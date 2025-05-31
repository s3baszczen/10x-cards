import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VALIDATION_CONSTANTS } from "@/types";

interface TextInputSectionProps {
  sourceText: string;
  onSourceTextChange: (text: string) => void;
  onGenerateClick: () => void;
  isGenerating: boolean;
  validationError?: string;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({
  sourceText,
  onSourceTextChange,
  onGenerateClick,
  isGenerating,
  validationError,
}) => {
  const characterCount = sourceText.length;
  const isValidLength =
    characterCount >= VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH &&
    characterCount <= VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSourceTextChange(e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2" role="heading">
          Enter Text for Flashcard Generation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="source-text" className="block text-sm font-medium mb-2">
              Source Text
            </label>
            <Textarea
              id="source-text"
              placeholder="Paste your text here (minimum 1000 characters)..."
              className="min-h-[200px] resize-y"
              value={sourceText}
              onChange={handleTextChange}
              disabled={isGenerating}
              aria-describedby="character-count text-validation"
            />

            <div className="flex justify-between mt-2 text-sm">
              <span
                id="character-count"
                className={`${!isValidLength && characterCount > 0 ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
              >
                {characterCount} / {VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH} characters
              </span>

              <span className="text-gray-500 dark:text-gray-400">
                Minimum: {VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} characters
              </span>
            </div>

            {validationError && (
              <p id="text-validation" className="mt-2 text-sm text-red-500 dark:text-red-400">
                {validationError}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onGenerateClick} disabled={!isValidLength || isGenerating} aria-busy={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Flashcards"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextInputSection;
