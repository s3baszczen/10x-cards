import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProposalItem from "./ProposalItem";
import type { FlashcardProposal } from "./hooks/useGeneratorState";

// Mock FlashcardPreview component to simplify testing
vi.mock("./FlashcardPreview", () => ({
  default: ({
    frontText,
    backText,
    isEditable,
    onEdit,
  }: {
    frontText: string;
    backText: string;
    isEditable?: boolean;
    onEdit?: (field: "front" | "back", value: string) => void;
  }) => (
    <div data-testid="flashcard-preview">
      <div data-testid="front-text">{frontText}</div>
      <div data-testid="back-text">{backText}</div>
      {isEditable && (
        <>
          <button data-testid="edit-front" onClick={() => onEdit?.("front", "Edited front text")}>
            Edit Front
          </button>
          <button data-testid="edit-back" onClick={() => onEdit?.("back", "Edited back text")}>
            Edit Back
          </button>
        </>
      )}
    </div>
  ),
}));

describe("ProposalItem", () => {
  const mockProposal: FlashcardProposal = {
    id: "1",
    frontText: "Test question",
    backText: "Test answer",
    status: "pending",
  };

  const mockOnAction = vi.fn();

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  it("renders with correct content and pending status", () => {
    render(<ProposalItem proposal={mockProposal} onAction={mockOnAction} />);

    expect(screen.getByTestId("front-text")).toHaveTextContent("Test question");
    expect(screen.getByTestId("back-text")).toHaveTextContent("Test answer");

    // Should have action buttons for pending status
    expect(screen.getByLabelText("Reject flashcard")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit flashcard")).toBeInTheDocument();
    expect(screen.getByLabelText("Accept flashcard")).toBeInTheDocument();
  });

  it("renders with accepted status correctly", () => {
    const acceptedProposal: FlashcardProposal = {
      ...mockProposal,
      status: "accepted",
    };

    render(<ProposalItem proposal={acceptedProposal} onAction={mockOnAction} />);

    // Should have accepted indicator
    expect(screen.getByText("Accepted")).toBeInTheDocument();

    // Should not have action buttons
    expect(screen.queryByLabelText("Reject flashcard")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Edit flashcard")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Accept flashcard")).not.toBeInTheDocument();
  });

  it("renders with rejected status correctly", () => {
    const rejectedProposal: FlashcardProposal = {
      ...mockProposal,
      status: "rejected",
    };

    render(<ProposalItem proposal={rejectedProposal} onAction={mockOnAction} />);

    // Should have rejected indicator
    expect(screen.getByText("Rejected")).toBeInTheDocument();

    // Should not have action buttons
    expect(screen.queryByLabelText("Reject flashcard")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Edit flashcard")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Accept flashcard")).not.toBeInTheDocument();
  });

  it("triggers onAction when accept button is clicked", () => {
    render(<ProposalItem proposal={mockProposal} onAction={mockOnAction} />);

    fireEvent.click(screen.getByLabelText("Accept flashcard"));

    expect(mockOnAction).toHaveBeenCalledWith("accept");
  });

  it("triggers onAction when reject button is clicked", () => {
    render(<ProposalItem proposal={mockProposal} onAction={mockOnAction} />);

    fireEvent.click(screen.getByLabelText("Reject flashcard"));

    expect(mockOnAction).toHaveBeenCalledWith("reject");
  });

  it("enters edit mode when edit button is clicked", () => {
    render(<ProposalItem proposal={mockProposal} onAction={mockOnAction} />);

    fireEvent.click(screen.getByLabelText("Edit flashcard"));

    expect(mockOnAction).toHaveBeenCalledWith("edit");
  });

  it("renders edit mode correctly", () => {
    const editingProposal: FlashcardProposal = {
      ...mockProposal,
      isEditing: true,
    };

    render(<ProposalItem proposal={editingProposal} onAction={mockOnAction} />);

    // Should have edit mode buttons
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();

    // Should not have action buttons in edit mode
    expect(screen.queryByLabelText("Reject flashcard")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Edit flashcard")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Accept flashcard")).not.toBeInTheDocument();
  });

  it("handles cancelling edit mode", () => {
    const editingProposal: FlashcardProposal = {
      ...mockProposal,
      isEditing: true,
    };

    render(<ProposalItem proposal={editingProposal} onAction={mockOnAction} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnAction).toHaveBeenCalledWith("edit");
  });

  it("handles saving edited content", async () => {
    const editingProposal: FlashcardProposal = {
      ...mockProposal,
      isEditing: true,
    };

    render(<ProposalItem proposal={editingProposal} onAction={mockOnAction} />);

    // Edit content using the mocked buttons
    fireEvent.click(screen.getByTestId("edit-front"));
    fireEvent.click(screen.getByTestId("edit-back"));

    // Save changes
    fireEvent.click(screen.getByText("Save Changes"));

    // Check if onAction was called with the correct parameters
    expect(mockOnAction).toHaveBeenCalledWith("edit", {
      id: "1",
      frontText: "Edited front text",
      backText: "Edited back text",
      status: "pending",
      isEditing: true,
    });
  });
});
