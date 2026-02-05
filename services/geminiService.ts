import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

let aiClient: GoogleGenAI | null = null;

// Initialize with environment variable
try {
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Google GenAI:", error);
}

export const getRobotFeedback = async (
  code: string,
  language: Language,
  goal: string
): Promise<{ text: string; emotion: 'happy' | 'thinking' | 'confused' | 'excited' }> => {
  if (!aiClient) {
    return {
      text: "I can't reach my brain servers right now! Check your API Key.",
      emotion: 'confused'
    };
  }

  const prompt = `
    You are a friendly, energetic robot tutor named "NextBot" for a child (age 8-12).
    The child is learning ${language}.
    
    Goal: ${goal}
    Child's Code:
    ${code}

    Task:
    1. Analyze if the code achieves the goal.
    2. If correct, give a short, high-energy congratulation (under 20 words).
    3. If incorrect, give a kind, simple hint (under 30 words). Do not give the answer directly.
    4. Choose an emotion: 'happy' (success), 'thinking' (incomplete), 'confused' (syntax error), 'excited' (great job).

    Output JSON format: { "text": "...", "emotion": "..." }
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      text: result.text || "I'm processing that logic!",
      emotion: result.emotion || 'thinking'
    };
  } catch (e) {
    console.error(e);
    return {
      text: "Beep boop! I had a glitch processing that. Try again?",
      emotion: 'confused'
    };
  }
};

export const simulateCodeExecution = async (code: string, language: Language): Promise<string> => {
  if (!aiClient) return "Error: AI not initialized.";

  // For JS, we might eval, but for safety and consistency with C/Python in this browser-only demo, let's ask Gemini.
  const prompt = `
    Act as a compiler/interpreter for ${language}.
    Execute the following code and return *only* the output it would produce on the console.
    If there is an error, return a simplified error message suitable for a child.
    
    Code:
    ${code}
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "";
  } catch (e) {
    return "Error interpreting code.";
  }
};
