import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextInputSection from './TextInputSection';
import { VALIDATION_CONSTANTS } from '@/types';

describe('TextInputSection', () => {
  const defaultProps = {
    sourceText: '',
    onSourceTextChange: vi.fn(),
    onGenerateClick: vi.fn(),
    isGenerating: false
  };

  it('renders with proper title and placeholder text', () => {
    render(<TextInputSection {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: /Enter Text for Flashcard Generation/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Paste your text here/i)).toBeInTheDocument();
  });

  it('shows character count and minimum character requirements', () => {
    render(<TextInputSection {...defaultProps} />);
    
    expect(screen.getByText(`0 / ${VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH} characters`)).toBeInTheDocument();
    expect(screen.getByText(`Minimum: ${VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} characters`)).toBeInTheDocument();
  });

  it('calls onSourceTextChange when text is entered', () => {
    render(<TextInputSection {...defaultProps} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text content' } });
    
    expect(defaultProps.onSourceTextChange).toHaveBeenCalledWith('New text content');
  });

  it('disables the generate button when text is too short', () => {
    // Text shorter than minimum length
    const shortText = 'A'.repeat(VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH - 1);
    
    render(
      <TextInputSection 
        {...defaultProps}
        sourceText={shortText}
      />
    );
    
    const button = screen.getByRole('button', { name: /Generate Flashcards/i });
    expect(button).toBeDisabled();
  });

  it('enables the generate button when text length is valid', () => {
    // Text of minimum valid length
    const validText = 'A'.repeat(VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH);
    
    render(
      <TextInputSection 
        {...defaultProps}
        sourceText={validText}
      />
    );
    
    const button = screen.getByRole('button', { name: /Generate Flashcards/i });
    expect(button).not.toBeDisabled();
  });

  it('disables the generate button when text is too long', () => {
    // Text longer than maximum length
    const longText = 'A'.repeat(VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH + 1);
    
    render(
      <TextInputSection 
        {...defaultProps}
        sourceText={longText}
      />
    );
    
    const button = screen.getByRole('button', { name: /Generate Flashcards/i });
    expect(button).toBeDisabled();
  });

  it('calls onGenerateClick when the button is clicked', () => {
    // Text of valid length
    const validText = 'A'.repeat(VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH);
    
    render(
      <TextInputSection 
        {...defaultProps}
        sourceText={validText}
      />
    );
    
    const button = screen.getByRole('button', { name: /Generate Flashcards/i });
    fireEvent.click(button);
    
    expect(defaultProps.onGenerateClick).toHaveBeenCalled();
  });

  it('disables the textarea and button while generating', () => {
    render(
      <TextInputSection 
        {...defaultProps}
        sourceText={'A'.repeat(VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH)}
        isGenerating={true}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Generating/i });
    
    expect(textarea).toBeDisabled();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Generating...');
  });

  it('displays validation error message when provided', () => {
    const errorMessage = 'Text must be in English';
    
    render(
      <TextInputSection 
        {...defaultProps}
        validationError={errorMessage}
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
