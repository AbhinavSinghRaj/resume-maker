import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;
  try {
    const { name, email } = await req.json();
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
      .from("signups")
      .insert({ name: typeof name === "string" ? name.trim().slice(0, 100) : "", email: email.trim().toLowerCase() });

    // 23505 = unique violation: already signed up, treat as success.
    if (error && error.code !== "23505") throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't save your signup. Please try again." }, { status: 500 });
  }
}
