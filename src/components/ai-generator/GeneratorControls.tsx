import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneratorControlsProps {
  onGenerate: () => void;
  onCancel?: () => void;
  isGenerating: boolean;
  isValid: boolean;
  models?: string[];
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  onGenerate,
  onCancel,
  isGenerating,
  isValid,
  models,
  selectedModel,
  onModelChange
}) => {
  const availableModels = models || ['gpt-4', 'gpt-3.5-turbo'];
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Model selector */}
      {onModelChange && (
        <div className="w-full md:w-48">
          <Select
            value={selectedModel}
            onValueChange={onModelChange}
            disabled={isGenerating}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wybierz model AI" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map(model => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex gap-3 w-full">
        {isGenerating ? (
          <>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Anuluj generowanie
            </Button>
          </>
        ) : (
          <Button 
            onClick={onGenerate} 
            disabled={!isValid}
            className="flex-1"
            aria-label="Generuj fiszki"
          >
            Generuj fiszki
          </Button>
        )}
      </div>
    </div>
  );
};

export default GeneratorControls;
