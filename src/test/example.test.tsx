import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Example component to test
function ExampleButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}>
      Click me
    </button>
  );
}

describe('Example test', () => {
  it('renders button and handles click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    
    render(<ExampleButton onClick={onClick} />);
    
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
