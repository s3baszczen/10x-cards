import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { VALIDATION_CONSTANTS } from '@/types';

interface FlashcardPreviewProps {
  frontText: string;
  backText: string;
  isEditable?: boolean;
  onEdit?: (field: 'front' | 'back', value: string) => void;
}

const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({
  frontText,
  backText,
  isEditable = false,
  onEdit
}) => {
  const [frontValue, setFrontValue] = useState(frontText);
  const [backValue, setBackValue] = useState(backText);
  const [frontError, setFrontError] = useState<string | undefined>();
  const [backError, setBackError] = useState<string | undefined>();

  const handleFrontChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFrontValue(value);
    
    if (value.length > VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH) {
      setFrontError(`Text must not exceed ${VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH} characters`);
    } else if (value.trim().length === 0) {
      setFrontError('Front text cannot be empty');
    } else {
      setFrontError(undefined);
      onEdit?.('front', value);
    }
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBackValue(value);
    
    if (value.length > VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH) {
      setBackError(`Text must not exceed ${VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH} characters`);
    } else if (value.trim().length === 0) {
      setBackError('Back text cannot be empty');
    } else {
      setBackError(undefined);
      onEdit?.('back', value);
    }
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="front" className="w-full">
        <CardHeader className="pb-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="front">Front</TabsTrigger>
            <TabsTrigger value="back">Back</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="pt-4">
          <TabsContent value="front" className="mt-0">
            {isEditable ? (
              <div>
                <Textarea
                  value={frontValue}
                  onChange={handleFrontChange}
                  placeholder="Enter front text"
                  className="min-h-[100px] resize-y"
                  aria-invalid={!!frontError}
                  aria-describedby={frontError ? "front-error" : undefined}
                />
                {frontError && (
                  <p id="front-error" className="text-sm text-red-500 mt-1">
                    {frontError}
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {frontValue.length} / {VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH}
                </div>
              </div>
            ) : (
              <div className="p-4 min-h-[100px] bg-muted rounded-md">
                {frontText}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="back" className="mt-0">
            {isEditable ? (
              <div>
                <Textarea
                  value={backValue}
                  onChange={handleBackChange}
                  placeholder="Enter back text"
                  className="min-h-[100px] resize-y"
                  aria-invalid={!!backError}
                  aria-describedby={backError ? "back-error" : undefined}
                />
                {backError && (
                  <p id="back-error" className="text-sm text-red-500 mt-1">
                    {backError}
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {backValue.length} / {VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH}
                </div>
              </div>
            ) : (
              <div className="p-4 min-h-[100px] bg-muted rounded-md">
                {backText}
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default FlashcardPreview;
