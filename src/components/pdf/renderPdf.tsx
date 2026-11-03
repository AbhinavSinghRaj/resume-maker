import { pdf } from "@react-pdf/renderer";
import type { Resume } from "@/lib/schema";
import { textScale, visibleResume, type TextSize } from "@/lib/resumeUtils";
import ResumePDF from "./ResumePDF";

interface Options {
  resume: Resume;
  template: string;
  hiddenSections: string[];
  textSize: TextSize;
}

/** Renders the resume exactly as it will be downloaded and returns the blob plus its page count. */
export async function renderResumePdf({ resume, template, hiddenSections, textSize }: Options) {
  const blob = await pdf(
    <ResumePDF resume={visibleResume(resume, hiddenSections)} templateId={template} scale={textScale[textSize] ?? 1} />
  ).toBlob();
  // react-pdf writes uncompressed page objects, so counting them is reliable enough for a hint.
  const pages = ((await blob.text()).match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length;
  return { blob, pages };
}
