import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Trophy, User } from 'lucide-react';
import { format } from 'date-fns';
import JoinGameButton from '@/components/JoinGameButton';
import { getUser } from '@/lib/auth';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GameDetailPage({ params }: PageProps) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;
    
    const supabase = await createClient();
    const user = await getUser();

    console.log('Fetching game with ID:', id);

    // Fetch game details - Fixed to use 'avatar' instead of 'avatar_url'
    const { data: game, error } = await supabase
      .from('games')
      .select(`
        *,
        host:users!games_host_id_fkey(id, name, avatar, email),
        game_participants(
          user_id,
          status,
          user:users(id, name, avatar)
        )
      `)
      .eq('id', id)
      .single();

    console.log('Game fetch result:', { game, error });

    if (error) {
      console.error('Error fetching game:', error);
      notFound();
    }

    if (!game) {
      console.log('Game not found');
      notFound();
    }

    const isHost = user?.id === game.host_id;
    const hasJoined = game.game_participants?.some(
      (p: any) => p.user_id === user?.id && p.status === 'ACCEPTED'
    );
    const isFull = game.current_players >= game.max_players;

    return (
      <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button - FIXED: Using Link instead of <a> tag */}
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/games" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Games
            </Link>
          </Button>

          {/* Header */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-white shadow-2xl">
            <div className="relative z-10">
              <Badge className="mb-4 bg-white/20 hover:bg-white/30">
                {game.status}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{game.title}</h1>
              {game.description && (
                <p className="text-emerald-50 text-lg">{game.description}</p>
              )}
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Game Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Date & Time</p>
                      <p className="text-muted-foreground">
                        {format(new Date(game.date), 'EEEE, MMMM d, yyyy')} at{' '}
                        {format(new Date(game.date), 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  {game.duration && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Duration</p>
                        <p className="text-muted-foreground">{game.duration} minutes</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-muted-foreground">{game.location}</p>
                      {game.address && (
                        <p className="text-sm text-muted-foreground">{game.address}</p>
                      )}
                    </div>
                  </div>

                  {game.skill_level && (
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Skill Level</p>
                        <p className="text-muted-foreground">{game.skill_level}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Players</p>
                      <p className="text-muted-foreground">
                        {game.current_players || 0} / {game.max_players} joined
                      </p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${((game.current_players || 0) / game.max_players) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participants */}
              <Card>
                <CardHeader>
                  <CardTitle>Players ({game.game_participants?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {game.game_participants && game.game_participants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {game.game_participants.map((participant: any) => (
                        <div
                          key={participant.user_id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            {participant.user?.avatar ? (
                              <img
                                src={participant.user.avatar}
                                alt={participant.user.name || 'Player'}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-emerald-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{participant.user?.name || 'Anonymous'}</p>
                            <p className="text-xs text-muted-foreground">
                              {participant.user_id === game.host_id && '👑 Host'}
                            </p>
                          </div>
                          <Badge variant={participant.status === 'ACCEPTED' ? 'default' : 'secondary'}>
                            {participant.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No players have joined yet. Be the first!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Host Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Hosted By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      {game.host?.avatar ? (
                        <img
                          src={game.host.avatar}
                          alt={game.host.name || 'Host'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{game.host?.name || 'Unknown Host'}</p>
                      {game.host?.email && (
                        <p className="text-sm text-muted-foreground">{game.host.email}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardContent className="pt-6">
                  {!user ? (
                    <Button className="w-full" asChild>
                      <Link href="/login">Sign In to Join</Link>
                    </Button>
                  ) : isHost ? (
                    <div className="space-y-2">
                      <Badge className="w-full justify-center py-2" variant="secondary">
                        You're the host
                      </Badge>
                      <Button className="w-full" variant="outline">
                        Manage Game
                      </Button>
                    </div>
                  ) : hasJoined ? (
                    <Badge className="w-full justify-center py-2 bg-emerald-600 text-white">
                      ✓ You've joined this game
                    </Badge>
                  ) : isFull ? (
                    <Badge className="w-full justify-center py-2" variant="destructive">
                      Game Full
                    </Badge>
                  ) : (
                    <JoinGameButton gameId={game.id} />
                  )}
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="pt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-emerald-900">Free to join</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-emerald-900">All equipment provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-emerald-900">Open to all skill levels</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Unexpected error in GameDetailPage:', error);
    notFound();
  }
}