import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GenerationStatus from './GenerationStatus';

describe('GenerationStatus', () => {
  it('renders with default status message when isGenerating is true', () => {
    render(<GenerationStatus isGenerating={true} />);
    
    expect(screen.getByText('Generating flashcards...')).toBeInTheDocument();
    expect(screen.getByLabelText('Generation progress')).toBeInTheDocument();
    expect(screen.getByText(/This may take up to a minute/i)).toBeInTheDocument();
  });

  it('renders with custom status message when provided', () => {
    const customMessage = 'Processing your content...';
    render(<GenerationStatus isGenerating={true} statusMessage={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('shows indeterminate progress when progress is 0', () => {
    render(<GenerationStatus isGenerating={true} progress={0} />);
    
    const progressBar = screen.getByLabelText('Generation progress');
    expect(progressBar).toHaveClass('animate-pulse');
    // In an indeterminate state, the Progress component shouldn't have a value attribute
    expect(progressBar).not.toHaveAttribute('value');
  });

  it('shows specific progress when progress value is provided', () => {
    const progressValue = 45;
    render(<GenerationStatus isGenerating={true} progress={progressValue} />);
    
    const progressBar = screen.getByLabelText('Generation progress');
    expect(progressBar).not.toHaveClass('animate-pulse');
    expect(progressBar).toHaveAttribute('value', progressValue.toString());
    expect(progressBar).toHaveAttribute('max', '100');
  });

  it('includes a spinning indicator when generating', () => {
    render(<GenerationStatus isGenerating={true} />);
    
    const spinningElement = screen.getByRole('img', { hidden: true });
    expect(spinningElement.parentElement).toHaveClass('animate-spin');
  });
});
