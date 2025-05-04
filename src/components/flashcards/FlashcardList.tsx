import React, { useEffect, useState } from 'react';
import type { FlashcardResponseDTO, FlashcardListResponseDTO } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface FlashcardListProps {
  initialPage?: number;
  initialLimit?: number;
}

const FlashcardList: React.FC<FlashcardListProps> = ({
  initialPage = 1,
  initialLimit = 10,
}) => {
  const [flashcards, setFlashcards] = useState<FlashcardResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: initialLimit.toString(),
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      const response = await fetch(`/api/flashcards?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }

      const data: FlashcardListResponseDTO = await response.json();
      setFlashcards(prevFlashcards => 
        page === 1 ? data.items : [...prevFlashcards, ...data.items]
      );
      setHasMore(data.has_more);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchFlashcards()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {flashcards.map(flashcard => (
        <Card key={flashcard.id}>
          <CardHeader>
            <div className="text-sm text-muted-foreground">
              Created: {new Date(flashcard.created_at).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="front">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="front">Front</TabsTrigger>
                <TabsTrigger value="back">Back</TabsTrigger>
              </TabsList>
              <TabsContent value="front" className="min-h-[100px] mt-4">
                <div className="p-4 bg-muted rounded-md">
                  {flashcard.front_text}
                </div>
              </TabsContent>
              <TabsContent value="back" className="min-h-[100px] mt-4">
                <div className="p-4 bg-muted rounded-md">
                  {flashcard.back_text}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      )}

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
