import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface CVAnalysis {
  score: number; // 0-100
  reasoning: string;
  extractedData: {
    name: string | null;
    email: string | null;
    phone: string | null;
    skills: string[];
    experience: string | null;
    education: string | null;
  };
  strengths: string[];
  weaknesses: string[];
}

export async function analyzeCV(
  cvText: string,
  jobRequirements?: string
): Promise<CVAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert HR recruiter. Analyze this CV and provide a detailed assessment.

${jobRequirements ? `Job Requirements:\n${jobRequirements}\n\n` : ""}CV Content:
${cvText}

Provide your analysis in the following JSON format:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation of the score>",
  "extractedData": {
    "name": "<candidate name or null>",
    "email": "<email or null>",
    "phone": "<phone or null>",
    "skills": ["skill1", "skill2", ...],
    "experience": "<years of experience or description>",
    "education": "<highest degree or description>"
  },
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...]
}

Scoring criteria:
- 90-100: Exceptional candidate, perfect fit
- 70-89: Strong candidate, good fit
- 50-69: Moderate candidate, some gaps
- 30-49: Weak candidate, significant gaps
- 0-29: Poor fit, major deficiencies

Be objective and thorough in your analysis. Return ONLY valid JSON, no markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const analysis: CVAnalysis = JSON.parse(cleanedText);
    return analysis;
  } catch (error) {
    console.error("Error analyzing CV with Gemini AI:", error);
    throw new Error("Failed to analyze CV");
  }
}

export async function analyzeWithRetry(
  cvText: string,
  jobRequirements?: string,
  maxRetries: number = 3
): Promise<CVAnalysis> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await analyzeCV(cvText, jobRequirements);
    } catch (error) {
      lastError = error as Error;
      console.log(`Retry ${i + 1}/${maxRetries} after error:`, error);
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }

  throw lastError || new Error("Failed to analyze CV after retries");
}
