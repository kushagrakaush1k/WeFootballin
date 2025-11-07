'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Trophy, Calendar, DollarSign } from 'lucide-react';

export default function StatsOverview() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    approvedTeams: 0,
    pendingPayments: 0,
    totalMatches: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const supabase = createClient();
    
    const [teams, approved, pending, matches] = await Promise.all([
      supabase.from('teams').select('id', { count: 'exact', head: true }),
      supabase.from('teams').select('id', { count: 'exact', head: true }).eq('payment_status', 'approved'),
      supabase.from('teams').select('id', { count: 'exact', head: true }).eq('payment_status', 'pending'),
      supabase.from('matches').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      totalTeams: teams.count || 0,
      approvedTeams: approved.count || 0,
      pendingPayments: pending.count || 0,
      totalMatches: matches.count || 0,
    });
  };

  const cards = [
    { label: 'Total Teams', value: stats.totalTeams, icon: Users, color: 'text-blue-500' },
    { label: 'Approved Teams', value: stats.approvedTeams, icon: Trophy, color: 'text-green-500' },
    { label: 'Pending Payments', value: stats.pendingPayments, icon: DollarSign, color: 'text-yellow-500' },
    { label: 'Total Matches', value: stats.totalMatches, icon: Calendar, color: 'text-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-8 h-8 ${card.color}`} />
            </div>
            <div className="text-3xl font-black">{card.value}</div>
            <div className="text-sm text-muted-foreground">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
}