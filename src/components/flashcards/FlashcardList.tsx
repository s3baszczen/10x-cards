import React, { useEffect, useState, useCallback } from "react";
import type { FlashcardResponseDTO, FlashcardListResponseDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import FlashcardPreview from "../generator/FlashcardPreview";

interface FlashcardListProps {
  initialPage?: number;
  initialLimit?: number;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ initialPage = 1, initialLimit = 10 }) => {
  const [flashcards, setFlashcards] = useState<FlashcardResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{ front_text?: string; back_text?: string }>({});

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: initialLimit.toString(),
        sortBy: "created_at",
        sortOrder: "desc",
      });

      const response = await fetch(`/api/flashcards?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch flashcards");
      }

      const data: FlashcardListResponseDTO = await response.json();
      setFlashcards((prevFlashcards) => (page === 1 ? data.items : [...prevFlashcards, ...data.items]));
      setHasMore(data.has_more);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, initialLimit]);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setEditedValues({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedValues({});
  };

  const handleSaveEdit = async (id: string) => {
    if (Object.keys(editedValues).length === 0) {
      handleCancelEdit();
      return;
    }

    try {
      const response = await fetch("/api/flashcards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...editedValues,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update flashcard");
      }

      const updatedFlashcard = await response.json();
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) => (card.id === id ? { ...card, ...updatedFlashcard } : card))
      );
      toast.success("Flashcard updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update flashcard");
    } finally {
      handleCancelEdit();
    }
  };

  const handleFieldEdit = (field: "front" | "back", value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [`${field}_text`]: value,
    }));
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flashcards.map((flashcard) => (
          <div key={flashcard.id} className="relative">
            <FlashcardPreview
              frontText={flashcard.front_text}
              backText={flashcard.back_text}
              isEditable={editingId === flashcard.id}
              onEdit={handleFieldEdit}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              {editingId === flashcard.id ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSaveEdit(flashcard.id)}
                    className="h-8 w-8 bg-white/90 hover:bg-white"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="h-8 w-8 bg-white/90 hover:bg-white"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEdit(flashcard.id)}
                  className="h-8 w-8 bg-white/90 hover:bg-white"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && hasMore && (
        <div className="text-center py-4">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}

      {!loading && flashcards.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">No flashcards found.</p>
          <Button asChild className="mt-4">
            <a href="/generate">Create Your First Flashcard</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlashcardList;
