"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast"

export default function Practice() {
  const [currentCard, setCurrentCard] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchNextCard();
  }, []);

  const fetchNextCard = async () => {
    const response = await fetch('/api/cards/next');
    if (response.ok) {
      const card = await response.json();
      setCurrentCard(card);
      setUserAnswer('');
    } else {
      toast({
        title: "No more cards",
        description: "You've reviewed all available cards.",
      });
      router.push('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentCard) {
      const isCorrect = userAnswer.toLowerCase() === currentCard.citation.toLowerCase();
      const scoreChange = isCorrect ? 1 : -1;

      await fetch('/api/cards/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentCard.id, score: scoreChange }),
      });

      toast({
        title: isCorrect ? "Correct!" : "Incorrect",
        description: `The correct answer was: ${currentCard.citation}`,
      });

      fetchNextCard();
    }
  };

  if (!currentCard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Memorize the Verse</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-center">{currentCard.content}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter the citation (e.g., John 3:16)"
            />
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}