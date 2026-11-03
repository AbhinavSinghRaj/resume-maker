import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { parseResumeText } from "@/lib/ai/prompts";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File is too large (max 5 MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (file.name.toLowerCase().endsWith(".pdf")) {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      try {
        text = (await parser.getText()).text;
      } finally {
        await parser.destroy();
      }
    } else if (file.name.toLowerCase().endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json({ error: "Only PDF or DOCX files are supported" }, { status: 400 });
    }

    if (!text || text.trim().length < 30) {
      return NextResponse.json({ error: "Couldn't read any text from this file — it may be a scanned image" }, { status: 400 });
    }

    const resume = await parseResumeText(text);
    return NextResponse.json(resume);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't read this resume. Please try again." }, { status: 500 });
  }
}