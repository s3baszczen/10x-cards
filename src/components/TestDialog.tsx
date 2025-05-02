import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const TestDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [textValue, setTextValue] = useState('');

  return (
    <div className="p-4 border rounded-md bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Test komponentu Dialog</h2>
      <p className="mb-4">Ten komponent służy do testowania, czy Dialog z shadcn/ui działa poprawnie.</p>
      
      {/* Dialog z przyciskiem w komponencie */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Metoda 1: Kontrolowany Dialog</h3>
        <Button onClick={() => {
          console.log('Przycisk otwierający dialog kliknięty');
          setIsOpen(true);
        }}>
          Otwórz Dialog (Kontrolowany)
        </Button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>To jest testowy dialog. Jeśli widzisz to okno, komponent Dialog działa poprawnie.</p>
              <Textarea 
                value={textValue}
                onChange={(e) => {
                  console.log('Zmiana wartości textarea:', e.target.value);
                  setTextValue(e.target.value);
                }}
                className="my-4" 
                placeholder="Wpisz coś tutaj..."
              />
              <p>Aktualna wartość: {textValue}</p>
              <Button onClick={() => {
                console.log('Przycisk w dialogu kliknięty');
                alert('Przycisk w dialogu został kliknięty!');
              }}>
                Kliknij mnie
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Dialog z DialogTrigger */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Metoda 2: Dialog z DialogTrigger</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => console.log('DialogTrigger kliknięty')}>
              Otwórz Dialog (z DialogTrigger)
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog z Trigger</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>To jest dialog otwierany przez DialogTrigger.</p>
              <Button onClick={() => {
                console.log('Przycisk w dialogu z trigger kliknięty');
                alert('Przycisk w dialogu z trigger został kliknięty!');
              }}>
                Kliknij mnie
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TestDialog;
