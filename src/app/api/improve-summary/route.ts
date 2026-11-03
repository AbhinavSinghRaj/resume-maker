import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/lib/ai/prompts";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;
  try {
    const { resume, keywords } = await req.json();
    if (!resume || typeof resume !== "object") {
      return NextResponse.json({ error: "Resume data is missing" }, { status: 400 });
    }
    const summary = await generateSummary(resume, Array.isArray(keywords) ? keywords : []);
    return NextResponse.json({ summary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't write a summary. Please try again." }, { status: 500 });
  }
}
