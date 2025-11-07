import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    console.log('📝 Signup request received:', { email, name, phone }); // DEBUG

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }

    console.log('✅ Auth user created:', authData.user.id);

    // 2. Insert into users table with phone
    const userData = {
      id: authData.user.id,
      email: authData.user.email!,
      name: name,
      phone: phone || null, // Use null if phone is empty
      role: 'PLAYER',
    };

    console.log('📤 Inserting user data:', userData); // DEBUG

    const { data: insertedUser, error: dbError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    console.log('✅ User inserted:', insertedUser);

    // 3. Create player stats
    const { error: statsError } = await supabase.from('player_stats').insert({
      user_id: authData.user.id,
    });

    if (statsError) {
      console.error('⚠️ Stats creation error:', statsError);
      // Don't fail the signup if stats creation fails
    }

    return NextResponse.json(
      { 
        user: authData.user,
        message: 'Account created successfully' 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('💥 Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}