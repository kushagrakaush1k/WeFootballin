import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const supabase = await createClient();

  const { data: games } = await supabase
    .from('games')
    .select(`
      *,
      host:users!games_host_id_fkey(id, name, email)
    `)
    .gte('date', new Date().toISOString())
    .eq('status', 'UPCOMING')
    .order('date', { ascending: true })
    .limit(50);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Find Games</h1>
            <p className="text-muted-foreground">Join upcoming football games in your area</p>
          </div>
          <Link href="/games/create">
            <Button className="football-gradient text-white shadow-lg hover:shadow-xl transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Host Game
            </Button>
          </Link>
        </div>

        {!games || games.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No games yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to host a game in your area!
              </p>
              <Link href="/games/create">
                <Button className="football-gradient text-white shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Host Your Game
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <Card className="h-full hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {game.title}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {game.skill_level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2 text-primary shrink-0" />
                      <span className="truncate">{formatDateTime(game.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 text-primary shrink-0" />
                      <span className="truncate">{game.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-primary shrink-0" />
                      <span className="font-medium">
                        {game.current_players} / {game.max_players} players
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{
                            width: `${Math.min((game.current_players / game.max_players) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground truncate">
                        Hosted by {game.host?.name || 'Anonymous'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}