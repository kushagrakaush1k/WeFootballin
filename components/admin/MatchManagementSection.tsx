'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Team } from '@/lib/supabase/database.types';
import { toast } from 'sonner';

export default function MatchManagementSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    team1_id: '',
    team2_id: '',
    team1_goals: 0,
    team2_goals: 0,
    match_date: '',
    venue: '',
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('teams')
      .select('*')
      .eq('payment_status', 'approved')
      .order('team_name');
    
    if (data) setTeams(data);
  };

  const handleSubmitResult = async () => {
    if (!formData.team1_id || !formData.team2_id) {
      toast.error('Please select both teams');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('matches')
      .insert({
        ...formData,
        status: 'completed',
      });

    if (error) {
      toast.error('Failed to record match');
    } else {
      toast.success('Match result recorded!');
      setFormData({
        team1_id: '',
        team2_id: '',
        team1_goals: 0,
        team2_goals: 0,
        match_date: '',
        venue: '',
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Record Match Result</h2>
      
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Team 1</Label>
            <Select value={formData.team1_id} onValueChange={(v) => setFormData({...formData, team1_id: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>{team.team_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Team 2</Label>
            <Select value={formData.team2_id} onValueChange={(v) => setFormData({...formData, team2_id: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>{team.team_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Team 1 Goals</Label>
            <Input
              type="number"
              min="0"
              value={formData.team1_goals}
              onChange={(e) => setFormData({...formData, team1_goals: parseInt(e.target.value)})}
            />
          </div>

          <div>
            <Label>Team 2 Goals</Label>
            <Input
              type="number"
              min="0"
              value={formData.team2_goals}
              onChange={(e) => setFormData({...formData, team2_goals: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Match Date</Label>
            <Input
              type="datetime-local"
              value={formData.match_date}
              onChange={(e) => setFormData({...formData, match_date: e.target.value})}
            />
          </div>

          <div>
            <Label>Venue</Label>
            <Input
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
              placeholder="Stadium name"
            />
          </div>
        </div>

        <Button onClick={handleSubmitResult} className="w-full">
          Submit Match Result
        </Button>
      </div>
    </div>
  );
}