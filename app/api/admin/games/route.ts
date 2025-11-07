import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const supabase = await createClient();

    const { error } = await supabase
      .from('games')
      .update({ status: body.status })
      .eq('id', body.gameId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const supabase = await createClient();

    const { error } = await supabase.from('games').delete().eq('id', body.gameId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}