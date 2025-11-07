import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: team } = await supabase
    .from('teams')
    .select(`
      *,
      team_players(*)
    `)
    .eq('captain_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-8">
          Welcome, <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
            {userData?.name}
          </span>
        </h1>

        {!team ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-3xl font-bold mb-4">No Team Registered Yet</h2>
            <p className="text-muted-foreground mb-8">
              Register your team now to participate in ROCK8 League!
            </p>
            <Link href="/register-team">
              <Button size="lg" className="football-gradient">
                Register Your Team
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4">{team.team_name}</h2>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {team.total_players} Players
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  team.payment_status === 'approved' 
                    ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                    : team.payment_status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                    : 'bg-red-500/20 text-red-700 dark:text-red-300'
                }`}>
                  Payment: {team.payment_status}
                </div>
                {team.league_group !== 'UNASSIGNED' && (
                  <div className="px-4 py-2 bg-primary/20 rounded-full text-sm font-semibold">
                    League {team.league_group}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-4xl font-black mb-2">{team.points}</div>
                <div className="text-muted-foreground">Points</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-4xl font-black mb-2">{team.matches_played}</div>
                <div className="text-muted-foreground">Matches Played</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-4xl font-black mb-2">{team.wins}-{team.draws}-{team.losses}</div>
                <div className="text-muted-foreground">W-D-L</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Link href="/leaderboard">
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary transition cursor-pointer">
              <Trophy className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">View Leaderboard</h3>
              <p className="text-muted-foreground">Check live standings</p>
            </div>
          </Link>
          <Link href="/profile">
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary transition cursor-pointer">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Your Profile</h3>
              <p className="text-muted-foreground">Manage your account</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}