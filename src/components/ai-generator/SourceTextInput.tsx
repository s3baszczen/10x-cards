import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VALIDATION_CONSTANTS } from '../../types';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface SourceTextInputProps {
  value: string;
  onChange: (text: string) => void;
  isValid: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
}

const SourceTextInput: React.FC<SourceTextInputProps> = ({
  value,
  onChange,
  isValid,
  errorMessage,
  isDisabled = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Handle file drop functionality
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isDisabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const textFiles = files.filter(file => 
      file.type === 'text/plain' || 
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'text/markdown'
    );
    
    if (textFiles.length > 0) {
      const file = textFiles[0]; // Use the first valid file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Remove excessive whitespace and normalize line breaks
          const text = event.target.result.toString()
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\n{3,}/g, '\n\n');
          
          onChange(text);
        }
      };
      reader.readAsText(file);
    }
  }, [onChange, isDisabled]);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to scrollHeight + 2px for border
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    }
  }, [value]);
  
  // Text cleaning when pasting
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (isDisabled) return;
    
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Clean the text (remove excessive whitespace and normalize line breaks)
    const cleanedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n');
    
    const textBeforeCursor = value.substring(0, e.currentTarget.selectionStart);
    const textAfterCursor = value.substring(e.currentTarget.selectionEnd);
    
    onChange(`${textBeforeCursor}${cleanedText}${textAfterCursor}`);
  }, [value, onChange, isDisabled]);
  
  const characterCount = value.length;
  const statusColor = isValid 
    ? 'text-green-700 dark:text-green-400' 
    : characterCount === 0 
      ? 'text-gray-500 dark:text-gray-400' 
      : 'text-red-700 dark:text-red-400';
  
  return (
    <Card className={`mb-4 ${isDragging ? 'border-2 border-blue-500 dark:border-blue-400' : ''}`}>
      <CardContent className="p-4">
        <div 
          className="relative" 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor="source-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tekst źródłowy
          </label>
          
          <Textarea
            id="source-text"
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            disabled={isDisabled}
            placeholder="Wprowadź lub wklej tekst, z którego chcesz wygenerować fiszki..."
            className={`min-h-[250px] w-full resize-none ${!isValid && characterCount > 0 ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            aria-invalid={!isValid && characterCount > 0}
            aria-describedby="source-text-error source-text-counter"
          />
          
          {isDragging && (
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center rounded-md pointer-events-none">
              <p className="text-blue-800 dark:text-blue-200 font-medium">Upuść plik tekstowy tutaj</p>
            </div>
          )}
          
          {errorMessage && characterCount > 0 && !isValid && (
            <p id="source-text-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          )}
          
          <div id="source-text-counter" className={`mt-2 text-sm flex justify-between ${statusColor}`}>
            <span>
              Licznik znaków: {characterCount}
            </span>
            <span>
              Wymagane: {VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} - {VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH} znaków
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SourceTextInput;
