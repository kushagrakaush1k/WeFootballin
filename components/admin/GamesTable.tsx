'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';

interface Game {
  id: string;
  title: string;
  location: string;
  date: Date;
  status: string;
  skillLevel: string;
  currentPlayers: number;
  maxPlayers: number;
  host: {
    name: string | null;
    email: string;
  };
  _count: {
    participants: number;
  };
}

export function GamesTable({ games }: { games: Game[] }) {
  const router = useRouter();
  const [deleteGameId, setDeleteGameId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (gameId: string, newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/games', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, status: newStatus }),
      });

      if (!res.ok) throw new Error('Update failed');
      router.refresh();
    } catch (error) {
      alert('Failed to update game status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteGameId) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/games', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: deleteGameId }),
      });

      if (!res.ok) throw new Error('Delete failed');

      router.refresh();
      setDeleteGameId(null);
    } catch (error) {
      alert('Failed to delete game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No games found
                </TableCell>
              </TableRow>
            ) : (
              games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/games/${game.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {game.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{game.host.name || 'Unknown'}</p>
                      <p className="text-muted-foreground">{game.host.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDateTime(game.date)}</TableCell>
                  <TableCell>{game.location}</TableCell>
                  <TableCell>
                    {game.currentPlayers}/{game.maxPlayers}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{game.skillLevel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        game.status === 'UPCOMING'
                          ? 'default'
                          : game.status === 'COMPLETED'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {game.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {game.status === 'UPCOMING' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(game.id, 'COMPLETED')}
                            disabled={loading}
                            title="Mark as completed"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(game.id, 'CANCELLED')}
                            disabled={loading}
                            title="Cancel game"
                          >
                            <XCircle className="w-4 h-4 text-orange-600" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteGameId(game.id)}
                        disabled={loading}
                        title="Delete game"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteGameId} onOpenChange={() => setDeleteGameId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the game and remove
              all participants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}