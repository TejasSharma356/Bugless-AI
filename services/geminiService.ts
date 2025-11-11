import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("API_KEY or GEMINI_API_KEY environment variable not set. Please create a .env.local file with GEMINI_API_KEY=your_key");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          line: { type: Type.INTEGER },
          type: { type: Type.STRING },
          message: { type: Type.STRING },
        },
        required: ["line", "type", "message"],
      },
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
    score: {
      type: Type.INTEGER,
      description: "An integer from 0 to 100 representing overall code quality.",
    },
    editedCode: {
      type: Type.STRING,
      description: "The full, corrected, and improved version of the user's code."
    },
  },
  required: ["issues", "suggestions", "score", "editedCode"],
};

const buildPrompt = (language: string, code: string): string => {
  return `
You are Bugless, a world-class senior software engineer AI specializing in code reviews.
Your task is to provide a comprehensive, professional-grade review of the following ${language} code.

Analyze the code for the following aspects:
1.  **Logic:** Identify any logical errors, edge cases not handled, or potential bugs.
2.  **Performance:** Spot any performance bottlenecks, inefficient algorithms, or memory leaks.
3.  **Readability & Style:** Check for adherence to best practices, clarity, naming conventions, and code smells.
4.  **Security:** Find potential security vulnerabilities.

Your response MUST be in a valid JSON format that strictly adheres to the provided schema. Do not add any text or formatting outside of the JSON structure.

The "type" in an issue must be one of: 'Logic', 'Performance', 'Readability', 'Security', 'Style'.

Provide a concise, high-level summary of suggestions for architectural or structural improvements.
Give an overall score from 0 to 100, where 100 is perfect code.

Finally, and most importantly, provide the complete, corrected version of the code in the "editedCode" field. This version should incorporate the most critical suggestions for logic, performance, and readability. It must be well-formatted with proper indentation according to ${language} conventions, resulting in a production-quality implementation.

Code to review:
\`\`\`${language}
${code}
\`\`\`
`;
};


export const analyzeCode = async (language: string, code: string): Promise<AnalysisResult> => {
  if (!API_KEY || !ai) {
    throw new Error("API key not configured. Please create a .env.local file with GEMINI_API_KEY=your_key and restart the server.");
  }

  try {
    const prompt = buildPrompt(language, code);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation
    if (!result || typeof result.score !== 'number' || !Array.isArray(result.issues) || !Array.isArray(result.suggestions) || typeof result.editedCode !== 'string') {
        throw new Error("Invalid response structure from Gemini API.");
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    if (error instanceof Error) {
      // Check for API key errors
      if (error.message.includes('API_KEY') || error.message.includes('403') || error.message.includes('401')) {
        throw new Error("Invalid or missing API key. Please check your GEMINI_API_KEY in .env.local file.");
      }
      // Check for quota/rate limit errors
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new Error("API rate limit exceeded. Please try again later or check your API quota.");
      }
      // Check for safety errors
      if (error.message.includes('SAFETY') || error.message.includes('safety')) {
        throw new Error("The code could not be processed due to safety settings. Please check the code for any sensitive or harmful content.");
      }
      // Check for network errors
      if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
        throw new Error("Network error. Please check your internet connection and try again.");
      }
      // Return the original error message if it's informative
      if (error.message.length < 200) {
        throw error;
      }
    }
    
    throw new Error("Failed to analyze code. The AI model may be temporarily unavailable or the request was invalid.");
  }
};
