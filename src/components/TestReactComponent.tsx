import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const TestReactComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('TestReactComponent zamontowany');
    
    // Prostszy sposób na sprawdzenie, czy JavaScript działa - 
    // dodajemy elementy bezpośrednio do DOM po załadowaniu
    const testElement = document.createElement('div');
    testElement.id = 'test-javascript-works';
    testElement.style.padding = '10px';
    testElement.style.margin = '10px';
    testElement.style.backgroundColor = 'red';
    testElement.style.color = 'white';
    testElement.textContent = 'Ten element został dodany przez JavaScript';
    document.body.prepend(testElement);
  }, []);

  return (
    <div className="p-4 border rounded-md bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Test Komponentu React</h2>
      <p className="mb-4">Ten komponent służy do testowania, czy React jest prawidłowo hydratowany.</p>
      <p className="mb-4">Licznik: {count}</p>
      <Button 
        onClick={() => {
          console.log('Przycisk kliknięty');
          setCount(count + 1);
          alert('Przycisk został kliknięty!');
        }}
      >
        Kliknij mnie!
      </Button>
    </div>
  );
};

export default TestReactComponent;
