import { createClient } from '@/lib/supabase/server';
import { GamesTable } from '@/components/admin/GamesTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AdminGamesPage() {
  const supabase = await createClient();

  const [
    { data: upcomingGames },
    { data: completedGames },
    { data: cancelledGames }
  ] = await Promise.all([
    supabase
      .from('games')
      .select(`
        *,
        host:users!games_host_id_fkey(name, email),
        game_participants(count)
      `)
      .eq('status', 'UPCOMING')
      .order('date', { ascending: true }),
    supabase
      .from('games')
      .select(`
        *,
        host:users!games_host_id_fkey(name, email),
        game_participants(count)
      `)
      .eq('status', 'COMPLETED')
      .order('date', { ascending: false })
      .limit(50),
    supabase
      .from('games')
      .select(`
        *,
        host:users!games_host_id_fkey(name, email),
        game_participants(count)
      `)
      .eq('status', 'CANCELLED')
      .order('updated_at', { ascending: false })
      .limit(50),
  ]);

  // Transform data for the table
  const transformGames = (games: any[]) => games?.map(game => ({
    ...game,
    _count: {
      participants: game.game_participants?.[0]?.count || 0
    }
  })) || [];

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Manage Games</h1>
          </div>
          <p className="text-muted-foreground">View, verify, and manage all games</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming ({upcomingGames?.length || 0})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedGames?.length || 0})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledGames?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Games</CardTitle>
              </CardHeader>
              <CardContent>
                <GamesTable games={transformGames(upcomingGames || [])} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Games</CardTitle>
              </CardHeader>
              <CardContent>
                <GamesTable games={transformGames(completedGames || [])} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled">
            <Card>
              <CardHeader>
                <CardTitle>Cancelled Games</CardTitle>
              </CardHeader>
              <CardContent>
                <GamesTable games={transformGames(cancelledGames || [])} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}