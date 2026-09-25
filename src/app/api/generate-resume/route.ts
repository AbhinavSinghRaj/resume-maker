import { NextRequest, NextResponse } from "next/server";
import { generateResumeFromProfile } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const { masterProfile, jdText } = await req.json();
    if (!masterProfile || masterProfile.trim().length < 30) {
      return NextResponse.json({ error: "Master profile bahut chhota hai" }, { status: 400 });
    }
    if (!jdText || jdText.trim().length < 20) {
      return NextResponse.json({ error: "JD bahut chhoti hai" }, { status: 400 });
    }
    const resume = await generateResumeFromProfile(masterProfile, jdText);
    return NextResponse.json(resume);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Resume generate nahi ho paaya" }, { status: 500 });
  }
}