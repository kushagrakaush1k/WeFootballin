'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface JoinGameButtonProps {
  gameId: string;
}

export default function JoinGameButton({ gameId }: JoinGameButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/games/${gameId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to join game');
      }

      // Refresh the page to show updated state
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleJoin}
        disabled={loading}
        className="w-full football-gradient text-white font-semibold h-12"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Join Game
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}