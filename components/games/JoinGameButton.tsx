'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface JoinGameButtonProps {
  gameId: string;
  hasJoined: boolean;
  isFull: boolean;
}

export function JoinGameButton({ gameId, hasJoined, isFull }: JoinGameButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/games/${gameId}`, {
        method: hasJoined ? 'DELETE' : 'POST',
      });

      if (!res.ok) throw new Error('Failed');
      router.refresh();
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (hasJoined) {
    return (
      <Button
        onClick={handleJoin}
        variant="outline"
        className="w-full h-12"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Leave Game'}
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button disabled className="w-full h-12">
        Game Full
      </Button>
    );
  }

  return (
    <Button
      onClick={handleJoin}
      className="w-full h-12 football-gradient text-white font-semibold"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : 'Join Game'}
    </Button>
  );
}