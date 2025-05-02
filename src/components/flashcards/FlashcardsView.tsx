import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, PlusIcon } from "lucide-react";
import GeneratorModal from '../ai-generator/GeneratorModal';
import type { FlashcardResponseDTO } from '@/types';
import './flashcard.css';

const FlashcardsView: React.FC = () => {
  const [flashcards, setFlashcards] = useState<FlashcardResponseDTO[]>([]);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Symulacja ładowania danych
    const loadFlashcards = async () => {
      setIsLoading(true);
      try {
        // W rzeczywistej implementacji pobieralibyśmy dane z API
        // Tutaj używamy przykładowych danych
        setTimeout(() => {
          setFlashcards([
            {
              id: '1',
              front_text: 'Co to jest Astro?',
              back_text: 'Astro to nowoczesny framework do budowania szybkich, opartych na treści stron internetowych z mniejszą ilością JavaScript po stronie klienta, używając "Islands Architecture".',
              creation: 'ai',
              generation_id: 'gen1',
              status: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '2',
              front_text: 'Co to jest React?',
              back_text: 'React to biblioteka JavaScript do budowania interfejsów użytkownika, która umożliwia tworzenie komponentów wielokrotnego użytku i efektywne aktualizowanie DOM za pomocą wirtualnego DOM.',
              creation: 'ai',
              generation_id: 'gen1',
              status: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '3',
              front_text: 'Co to jest Tailwind CSS?',
              back_text: 'Tailwind CSS to framework CSS typu utility-first, który pozwala szybko budować niestandardowe projekty bezpośrednio w znacznikach HTML poprzez stosowanie klas narzędziowych.',
              creation: 'manual',
              generation_id: 'gen2',
              status: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Błąd podczas ładowania fiszek:', error);
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, []);

  const handleNewFlashcards = (newCards: FlashcardResponseDTO[]) => {
    setFlashcards(prev => [...newCards, ...prev]);
    setIsGeneratorOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => setIsGeneratorOpen(true)}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Generuj z AI
        </Button>
        <Button 
          variant="default" 
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Dodaj fiszkę
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : flashcards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((flashcard) => (
            <FlashcardItem key={flashcard.id} flashcard={flashcard} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Nie masz jeszcze żadnych fiszek</h2>
          <p className="mb-6 text-muted-foreground">
            Dodaj fiszki ręcznie lub wygeneruj je za pomocą AI, aby rozpocząć naukę.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="default" 
              onClick={() => setIsGeneratorOpen(true)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generuj z AI
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Dodaj fiszkę
            </Button>
          </div>
        </div>
      )}

      <GeneratorModal 
        isOpen={isGeneratorOpen} 
        onOpenChange={setIsGeneratorOpen} 
      />
    </div>
  );
};

interface FlashcardItemProps {
  flashcard: FlashcardResponseDTO;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ flashcard }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="h-64 perspective-1000 cursor-pointer" 
      onClick={() => setFlipped(!flipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <Card className={`absolute w-full h-full backface-hidden ${
          flipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <CardHeader>
            <CardTitle className="line-clamp-2">{flashcard.front_text}</CardTitle>
            <CardDescription>
              {flashcard.creation === 'ai' ? (
                <span className="flex items-center text-xs">
                  <Sparkles className="w-3 h-3 mr-1 text-blue-500" />
                  Wygenerowano przez AI
                </span>
              ) : (
                <span className="text-xs">Stworzone ręcznie</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center h-20">
              <span>Kliknij, aby zobaczyć odpowiedź</span>
            </div>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card className={`absolute w-full h-full backface-hidden rotate-y-180 ${
          flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Odpowiedź</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-6">{flashcard.back_text}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardsView;
