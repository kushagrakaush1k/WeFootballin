import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Wrap requireAuth in try-catch to handle auth errors properly
    let user;
    try {
      user = await requireAuth();
    } catch (authError) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to create a game' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.location || !body.address || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: game, error } = await supabase
      .from('games')
      .insert({
        title: body.title,
        description: body.description || '',
        location: body.location,
        address: body.address,
        date: new Date(body.date).toISOString(),
        duration: body.duration,
        max_players: body.maxPlayers,
        skill_level: body.skillLevel,
        host_id: user.id,
        current_players: 1,
        status: 'UPCOMING',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ game }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create game' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();
    
    let query = supabase
      .from('games')
      .select(`
        *,
        host:users!games_host_id_fkey(id, name, avatar_url)
      `)
      .order('date', { ascending: true });

    // Optional filters
    const status = searchParams.get('status');
    if (status) {
      query = query.eq('status', status);
    }

    const { data: games, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ games }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch games' },
      { status: 500 }
    );
  }
}