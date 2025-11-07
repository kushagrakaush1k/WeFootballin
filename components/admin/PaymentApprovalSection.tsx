'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { TeamWithPlayers } from '@/lib/supabase/database.types';
import { Check, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentApprovalSection() {
  const [pendingTeams, setPendingTeams] = useState<TeamWithPlayers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingTeams();
  }, []);

  const fetchPendingTeams = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_players(*),
        captain:users!captain_id(id, name, email)
      `)
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPendingTeams(data as any);
    }
    setLoading(false);
  };

  const handleApprove = async (teamId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('teams')
      .update({ 
        payment_status: 'approved',
        league_group: 'UNASSIGNED' // Admin can assign later
      })
      .eq('id', teamId);

    if (error) {
      toast.error('Failed to approve payment');
    } else {
      toast.success('Payment approved!');
      fetchPendingTeams();
    }
  };

  const handleReject = async (teamId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('teams')
      .update({ payment_status: 'rejected' })
      .eq('id', teamId);

    if (error) {
      toast.error('Failed to reject payment');
    } else {
      toast.success('Payment rejected');
      fetchPendingTeams();
    }
  };

  if (loading) return <div>Loading...</div>;

  if (pendingTeams.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">No pending payments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payment Approvals</h2>
      
      {pendingTeams.map((team) => (
        <div key={team.id} className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{team.team_name}</h3>
              <p className="text-sm text-muted-foreground">
                Captain: {(team.captain as any)?.name} ({(team.captain as any)?.email})
              </p>
              <p className="text-sm text-muted-foreground">
                Players: {team.total_players}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(team.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(team.id)}
                variant="destructive"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>

          <div className="text-sm">
            <p className="font-semibold">Google Form ID:</p>
            <p className="text-muted-foreground">{team.google_form_submission_id || 'Not provided'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}