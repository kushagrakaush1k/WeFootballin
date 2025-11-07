import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PaymentApprovalSection from '@/components/admin/PaymentApprovalSection';
import MatchManagementSection from '@/components/admin/MatchManagementSection';
import StatsOverview from '@/components/admin/StatsOverview';

export default async function AdminPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-5xl font-black">
          <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
            Admin
          </span>
          <span className="text-foreground"> Dashboard</span>
        </h1>

        <StatsOverview />
        <PaymentApprovalSection />
        <MatchManagementSection />
      </div>
    </div>
  );
}