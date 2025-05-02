import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AIGeneratorContainer from './AIGeneratorContainer';

interface GeneratorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const GeneratorModal: React.FC<GeneratorModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generator AI</DialogTitle>
        </DialogHeader>
        <AIGeneratorContainer 
          isModal={true} 
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default GeneratorModal;
