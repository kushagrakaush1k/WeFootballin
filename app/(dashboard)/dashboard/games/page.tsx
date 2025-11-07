import { getUserWithRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default async function DashboardGamesPage() {
  const user = await getUserWithRole();
  const supabase = await createClient();

  // Hosted games
  const { data: hostedGames } = await supabase
    .from('games')
    .select('*, game_participants(id, user:users(name))')
    .eq('host_id', user!.id)
    .eq('status', 'UPCOMING')
    .order('date', { ascending: true });

  // Joined games
  const { data: joinedGamesData } = await supabase
    .from('game_participants')
    .select('game:games(*, host:users!games_host_id_fkey(name))')
    .eq('user_id', user!.id)
    .eq('status', 'CONFIRMED');

  const joinedGames = joinedGamesData?.map((item: any) => item.game).filter((g: any) => g.status === 'UPCOMING') || [];

  // Past games
  const { data: pastGamesData } = await supabase
    .from('games')
    .select('*, host:users!games_host_id_fkey(name)')
    .or(`host_id.eq.${user!.id}`)
    .eq('status', 'COMPLETED')
    .order('date', { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Games</h1>
            <p className="text-muted-foreground">Manage your hosted and joined games</p>
          </div>
          <Link href="/games/create">
            <Button className="football-gradient text-white">
              <Plus className="mr-2 h-4 w-4" />
              Host New Game
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="hosted" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hosted">Hosted ({hostedGames?.length || 0})</TabsTrigger>
            <TabsTrigger value="joined">Joined ({joinedGames?.length || 0})</TabsTrigger>
            <TabsTrigger value="past">Past Games ({pastGamesData?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="hosted" className="space-y-4">
            {!hostedGames || hostedGames.length === 0 ? (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No hosted games</h3>
                <p className="text-muted-foreground mb-4">Start by creating your first game</p>
                <Link href="/games/create">
                  <Button className="football-gradient text-white">Host a Game</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4">
                {hostedGames.map((game: any) => (
                  <Link key={game.id} href={`/games/${game.id}`}>
                    <Card className="hover:shadow-lg hover:border-primary/50 transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl">{game.title}</CardTitle>
                          <Badge>Hosting</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          {formatDateTime(game.date)}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-primary" />
                          {game.location}
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-primary" />
                          {game.current_players}/{game.max_players} players
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="joined" className="space-y-4">
            {!joinedGames || joinedGames.length === 0 ? (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No joined games</h3>
                <p className="text-muted-foreground mb-4">Browse and join available games</p>
                <Link href="/games">
                  <Button className="football-gradient text-white">Browse Games</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4">
                {joinedGames.map((game: any) => (
                  <Link key={game.id} href={`/games/${game.id}`}>
                    <Card className="hover:shadow-lg hover:border-primary/50 transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl">{game.title}</CardTitle>
                          <Badge variant="secondary">Joined</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          {formatDateTime(game.date)}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-primary" />
                          {game.location}
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-primary" />
                          {game.current_players}/{game.max_players} players
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {!pastGamesData || pastGamesData.length === 0 ? (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No past games</h3>
                <p className="text-muted-foreground">Your game history will appear here</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pastGamesData.map((game: any) => (
                  <Card key={game.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{game.title}</CardTitle>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {formatDateTime(game.date)}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        {game.location}
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        {game.current_players}/{game.max_players} players
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}