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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  createdAt: Date;
  playerStats: {
    goals: number;
    assists: number;
    gamesPlayed: number;
    rating: number;
  } | null;
  _count: {
    hostedGames: number;
    participations: number;
  };
}

export function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();
  const [editUser, setEditUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    goals: 0,
    assists: 0,
    gamesPlayed: 0,
    rating: 1000,
  });

  const handleEdit = (user: User) => {
    setEditUser(user);
    setFormData({
      role: user.role,
      goals: user.playerStats?.goals || 0,
      assists: user.playerStats?.assists || 0,
      gamesPlayed: user.playerStats?.gamesPlayed || 0,
      rating: user.playerStats?.rating || 1000,
    });
  };

  const handleSubmit = async () => {
    if (!editUser) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editUser.id,
          ...formData,
        }),
      });

      if (!res.ok) throw new Error('Update failed');

      router.refresh();
      setEditUser(null);
    } catch (error) {
      alert('Failed to update user');
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Games</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user.playerStats
                      ? `${user.playerStats.goals}G ${user.playerStats.assists}A`
                      : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user._count.hostedGames} hosted / {user._count.participations} joined
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user role and player statistics
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLAYER">PLAYER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Goals</Label>
                <Input
                  type="number"
                  value={formData.goals}
                  onChange={(e) =>
                    setFormData({ ...formData, goals: parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Assists</Label>
                <Input
                  type="number"
                  value={formData.assists}
                  onChange={(e) =>
                    setFormData({ ...formData, assists: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Games Played</Label>
                <Input
                  type="number"
                  value={formData.gamesPlayed}
                  onChange={(e) =>
                    setFormData({ ...formData, gamesPlayed: parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Rating</Label>
                <Input
                  type="number"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full football-gradient text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}