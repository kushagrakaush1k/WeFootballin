import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const supabase = await createClient();

    // Update user role
    const { error: userError } = await supabase
      .from('users')
      .update({ role: body.role })
      .eq('id', body.userId);

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Update stats if provided
    if (body.goals !== undefined || body.assists !== undefined) {
      const { error: statsError } = await supabase
        .from('player_stats')
        .update({
          goals: body.goals,
          assists: body.assists,
          games_played: body.gamesPlayed,
          rating: body.rating,
        })
        .eq('user_id', body.userId);

      if (statsError) {
        return NextResponse.json({ error: statsError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}