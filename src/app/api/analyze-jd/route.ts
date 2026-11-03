import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { analyzeJD } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;
  try {
    const { jdText } = await req.json();
    if (!jdText || typeof jdText !== "string" || jdText.trim().length < 20) {
      return NextResponse.json({ error: "The job description is too short" }, { status: 400 });
    }
    const analysis = await analyzeJD(jdText);
    return NextResponse.json(analysis);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't analyze the job description. Please try again." }, { status: 500 });
  }
}