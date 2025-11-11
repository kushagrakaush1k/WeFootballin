import { requireAuth, getUserWithRole } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const authResult = await requireAuth();

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, supabase } = authResult;

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user, profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authResult = await requireAuth();

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, supabase } = authResult;

  try {
    const body = await request.json();

    // Update user metadata
    const { error: userError } = await supabase.auth.updateUser({
      data: {
        full_name: body.full_name,
        phone: body.phone,
      },
    });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Update profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: body.full_name,
        phone: body.phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
