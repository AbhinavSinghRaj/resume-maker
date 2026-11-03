import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { rewriteBullets } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;
  try {
    const { bullet, title, company, keywords } = await req.json();
    if (!bullet || typeof bullet !== "string" || bullet.trim().length < 5) {
      return NextResponse.json({ error: "This bullet is too short to improve" }, { status: 400 });
    }
    const [rewritten] = await rewriteBullets(
      [bullet],
      { title: title || "", company: company || "" },
      Array.isArray(keywords) ? keywords : []
    );
    return NextResponse.json({ bullet: rewritten });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't improve this bullet. Please try again." }, { status: 500 });
  }
}