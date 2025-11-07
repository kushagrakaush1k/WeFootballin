import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TeamRegistrationForm from '@/components/registration/TeamRegistrationForm';

export default async function RegisterTeamPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirectTo=/register-team');
  }

  // Check if user already has a team
  const { data: existingTeam } = await supabase
    .from('teams')
    .select('id, team_name, payment_status')
    .eq('captain_id', user.id)
    .single();

  if (existingTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Team Already Registered</h1>
            <p className="text-muted-foreground mb-6">
              You have already registered the team <strong>{existingTeam.team_name}</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Payment Status: <span className="font-semibold capitalize">{existingTeam.payment_status}</span>
            </p>
            <a
              href="/dashboard"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-primary via-green-500 to-emerald-600 bg-clip-text text-transparent">
              Register Your Team
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Join the ROCK8 League - 3 Lakh Prize Pool + Exclusive Brand Partnerships!
          </p>
        </div>

        <TeamRegistrationForm userId={user.id} />
      </div>
    </div>
  );
}