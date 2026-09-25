import { NextRequest, NextResponse } from "next/server";
import { analyzeJD } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const { jdText } = await req.json();
    if (!jdText || typeof jdText !== "string" || jdText.trim().length < 20) {
      return NextResponse.json({ error: "JD text bahut chhota hai" }, { status: 400 });
    }
    const analysis = await analyzeJD(jdText);
    return NextResponse.json(analysis);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "JD analyze nahi ho payi" }, { status: 500 });
  }
}