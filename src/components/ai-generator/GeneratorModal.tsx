import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AIGeneratorContainer from './AIGeneratorContainer';
import type { FlashcardResponseDTO } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface GeneratorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFlashcardsGenerated?: (flashcards: FlashcardResponseDTO[]) => void;
}

const GeneratorModal: React.FC<GeneratorModalProps> = ({
  isOpen,
  onOpenChange,
  onFlashcardsGenerated,
}) => {
  console.log("GeneratorModal rendering", { isOpen });
  
  // Dodamy stan do śledzenia wartości w textarea do testów
  const [textValue, setTextValue] = useState('');
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Generator Fiszek AI</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          <p>Wprowadź tekst źródłowy, z którego chcesz wygenerować fiszki:</p>
          
          <Textarea 
            value={textValue}
            onChange={(e) => {
              console.log('Zmiana wartości textarea:', e.target.value);
              setTextValue(e.target.value);
            }}
            className="min-h-[200px]" 
            placeholder="Wprowadź tekst, z którego chcesz wygenerować fiszki..."
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button onClick={() => {
              console.log('Przycisk generowania fiszek kliknięty');
              alert('Przycisk "Generuj fiszki" został kliknięty! Tekst: ' + textValue);
              
              // Przykładowe dane - później zastąpimy je prawdziwymi danymi z API
              if (onFlashcardsGenerated) {
                const mockFlashcards: FlashcardResponseDTO[] = [
                  {
                    id: 'test-1',
                    front_text: 'Pytanie 1 z tekstu',
                    back_text: 'Odpowiedź 1 z tekstu',
                    creation: 'ai',
                    generation_id: 'test-gen',
                    status: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  }
                ];
                onFlashcardsGenerated(mockFlashcards);
              }
            }}>
              Generuj fiszki
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratorModal;
