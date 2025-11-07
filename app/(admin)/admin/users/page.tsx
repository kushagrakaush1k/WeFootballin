import { createClient } from '@/lib/supabase/server';
import { UsersTable } from '@/components/admin/UsersTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('users')
    .select(`
      *,
      player_stats(*),
      hosted_games:games!games_host_id_fkey(count),
      participations:game_participants(count)
    `)
    .order('created_at', { ascending: false });

  // Transform data for the table
  const usersWithCounts = users?.map(user => ({
    ...user,
    _count: {
      hostedGames: user.hosted_games?.[0]?.count || 0,
      participations: user.participations?.[0]?.count || 0,
    }
  })) || [];

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Manage Users</h1>
          </div>
          <p className="text-muted-foreground">View and manage all registered users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({usersWithCounts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable users={usersWithCounts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}