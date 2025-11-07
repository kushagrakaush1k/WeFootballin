// Save this file at: app/api/games/[id]/join/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    console.log('User check:', { user: user?.id, error: userError });

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    // Check if game exists and has space
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id, max_players, current_players, status, host_id')
      .eq('id', gameId)
      .single();

    console.log('Game check:', { game, error: gameError });

    if (gameError || !game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Check if user is the host
    if (game.host_id === user.id) {
      return NextResponse.json(
        { error: 'You are the host of this game' },
        { status: 400 }
      );
    }

    // Allow joining for SCHEDULED or UPCOMING games
    if (game.status !== 'SCHEDULED' && game.status !== 'UPCOMING') {
      return NextResponse.json(
        { error: 'Game is not available for joining' },
        { status: 400 }
      );
    }

    if (game.current_players >= game.max_players) {
      return NextResponse.json(
        { error: 'Game is full' },
        { status: 400 }
      );
    }

    // Check if already joined
    const { data: existingParticipant } = await supabase
      .from('game_participants')
      .select('id, status')
      .eq('game_id', gameId)
      .eq('user_id', user.id)
      .single();

    console.log('Existing participant check:', existingParticipant);

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'You have already joined this game' },
        { status: 400 }
      );
    }

    // Add participant
    const { error: insertError } = await supabase
      .from('game_participants')
      .insert({
        game_id: gameId,
        user_id: user.id,
        status: 'CONFIRMED',
      });

    if (insertError) {
      console.error('Error inserting participant:', insertError);
      return NextResponse.json(
        { error: 'Failed to join game: ' + insertError.message },
        { status: 500 }
      );
    }

    // Update current_players count
    const { error: updateError } = await supabase
      .from('games')
      .update({ current_players: (game.current_players || 0) + 1 })
      .eq('id', gameId);

    if (updateError) {
      console.error('Error updating player count:', updateError);
      // Don't fail the request if count update fails
    }

    return NextResponse.json(
      { message: 'Successfully joined game' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in join game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}