// @ts-ignore
const pdf = require("pdf-parse");

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF file");
  }
}

export function extractContactInfo(text: string) {
  // Email regex
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const emails = text.match(emailRegex) || [];

  // Phone regex (international formats)
  const phoneRegex = /(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{7,}/g;
  const phones = text.match(phoneRegex) || [];

  // Name extraction (first line or after "Name:" keyword)
  const nameMatch = text.match(/(?:Name|Full Name)[\s:]+([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/i);
  const name = nameMatch ? nameMatch[1] : null;

  return {
    email: emails[0] || null,
    phone: phones[0]?.trim() || null,
    name,
  };
}

export function extractSkills(text: string): string[] {
  // Common tech skills keywords
  const skillKeywords = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Go", "Rust",
    "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", "Spring", "Laravel",
    "HTML", "CSS", "SASS", "Tailwind", "Bootstrap",
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD",
    "Git", "GitHub", "GitLab", "Jira", "Agile", "Scrum",
    "Machine Learning", "AI", "Data Science", "TensorFlow", "PyTorch",
    "SQL", "NoSQL", "GraphQL", "REST API", "Microservices",
  ];

  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();

  for (const skill of skillKeywords) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }

  return [...new Set(foundSkills)]; // Remove duplicates
}

export function estimateExperience(text: string): string | null {
  // Look for patterns like "5 years", "3+ years", "2-4 years"
  const expRegex = /(\d+)[\s-]*(?:\+|to|\-)?\s*(\d+)?\s*(?:years?|yrs?)/gi;
  const matches = text.match(expRegex);

  if (matches && matches.length > 0) {
    return matches[0];
  }

  // Count job positions as rough estimate
  const jobCount = (text.match(/(?:software engineer|developer|programmer|analyst)/gi) || []).length;
  if (jobCount > 0) {
    return `~${jobCount} positions`;
  }

  return null;
}

export function extractEducation(text: string): string | null {
  // Look for degree keywords
  const degreeRegex = /(Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|B\.?Tech|M\.?Tech)[\s\w]*/gi;
  const degrees = text.match(degreeRegex);

  if (degrees && degrees.length > 0) {
    return degrees.join(", ");
  }

  return null;
}
