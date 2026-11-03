import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { generateCoverLetter } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;
  try {
    const { masterProfile, jdText } = await req.json();
    if (!masterProfile || masterProfile.trim().length < 30) {
      return NextResponse.json({ error: "Your master profile is too short" }, { status: 400 });
    }
    if (!jdText || jdText.trim().length < 20) {
      return NextResponse.json({ error: "The job description is too short" }, { status: 400 });
    }
    const coverLetter = await generateCoverLetter(masterProfile, jdText);
    return NextResponse.json({ coverLetter });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't generate the cover letter. Please try again." }, { status: 500 });
  }
}