import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, PlusIcon } from "lucide-react";
import type { FlashcardResponseDTO } from '@/types';
import './flashcard.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Komponent pojedynczej fiszki
const FlashcardItem: React.FC<{ flashcard: FlashcardResponseDTO }> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <Card className="flashcard-card front">
        <CardHeader>
          <CardTitle>{flashcard.front_text}</CardTitle>
          <CardDescription>
            {flashcard.creation === 'ai' ? 'Wygenerowano przez AI' : 'Utworzono ręcznie'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          Kliknij, aby odwrócić
        </CardContent>
      </Card>
      <Card className="flashcard-card back">
        <CardHeader>
          <CardTitle>Odpowiedź</CardTitle>
        </CardHeader>
        <CardContent>
          {flashcard.back_text}
        </CardContent>
      </Card>
    </div>
  );
};

const FlashcardsView: React.FC = () => {
  const [flashcards, setFlashcards] = useState<FlashcardResponseDTO[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Ładowanie przykładowych fiszek
  useEffect(() => {
    setIsLoading(true);
    
    // Symulacja ładowania danych
    setTimeout(() => {
      const exampleFlashcards: FlashcardResponseDTO[] = [
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
      ];
      
      setFlashcards(exampleFlashcards);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Obsługa generowania nowych fiszek
  const handleGenerateFlashcards = () => {
    if (!textInput.trim()) {
      alert('Wprowadź tekst, aby wygenerować fiszki!');
      return;
    }
    
    // Przykładowa nowa fiszka
    const newFlashcard: FlashcardResponseDTO = {
      id: `new-${Date.now()}`,
      front_text: `Pytanie wygenerowane z: ${textInput.substring(0, 20)}...`,
      back_text: `Odpowiedź wygenerowana dla tekstu: ${textInput.substring(0, 30)}...`,
      creation: 'ai',
      generation_id: `gen-${Date.now()}`,
      status: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Dodanie nowej fiszki na początek listy
    setFlashcards(prev => [newFlashcard, ...prev]);
    
    // Zamknięcie dialogu
    setDialogOpen(false);
    setTextInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => setDialogOpen(true)}
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
              onClick={() => setDialogOpen(true)}
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

      {/* Dialog do generowania fiszek */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Generator Fiszek AI</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <p>Wprowadź tekst źródłowy, z którego chcesz wygenerować fiszki:</p>
            
            <Textarea 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[200px]" 
              placeholder="Wprowadź tekst, z którego chcesz wygenerować fiszki..."
            />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Anuluj
              </Button>
              <Button onClick={handleGenerateFlashcards}>
                Generuj fiszki
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlashcardsView;
