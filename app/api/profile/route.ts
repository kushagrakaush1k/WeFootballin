import { requireAuth, getUserWithRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getUserWithRole();
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const supabase = await createClient();

    // Update user
    const { error: userError } = await supabase
      .from('users')
      .update({
        name: body.name,
        phone: body.phone,
      })
      .eq('id', user.id);

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Update stats if provided
    if (body.position || body.preferredFoot) {
      const { error: statsError } = await supabase
        .from('player_stats')
        .update({
          position: body.position,
          preferred_foot: body.preferredFoot,
        })
        .eq('user_id', user.id);

      if (statsError) {
        console.error('Stats update error:', statsError);
      }
    }

    return NextResponse.json({ message: 'Profile updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}