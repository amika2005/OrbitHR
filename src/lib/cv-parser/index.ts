import { parsePDF, extractContactInfo, extractSkills, estimateExperience, extractEducation } from "./pdf-parser";
import { parseDOCX } from "./docx-parser";

export interface ParsedCV {
  text: string;
  candidateName: string | null;
  candidateEmail: string | null;
  candidatePhone: string | null;
  skills: string[];
  experience: string | null;
  education: string | null;
}

export async function parseCV(buffer: Buffer, fileType: string): Promise<ParsedCV> {
  let text: string;

  // Parse based on file type
  if (fileType === "pdf") {
    text = await parsePDF(buffer);
  } else if (fileType === "docx") {
    text = await parseDOCX(buffer);
  } else {
    // Assume plain text
    text = buffer.toString("utf-8");
  }

  // Extract structured data
  const contactInfo = extractContactInfo(text);
  const skills = extractSkills(text);
  const experience = estimateExperience(text);
  const education = extractEducation(text);

  return {
    text,
    candidateName: contactInfo.name,
    candidateEmail: contactInfo.email,
    candidatePhone: contactInfo.phone,
    skills,
    experience,
    education,
  };
}
