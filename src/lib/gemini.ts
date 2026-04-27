import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export interface LetterFormData {
  govtBody: string;
  ministry: string;
  letterType: string;
  category: string;
  referenceText: string;
}

export async function generateLetter(data: LetterFormData) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert government relations consultant specializing in the medical and healthcare sector. 
    Your task is to draft a formal, professional, and persuasive letter to a government body.

    CONTEXT:  
    - Government Body: ${data.govtBody}
    - Ministry/Department: ${data.ministry}
    - Category: ${data.category}
    - Type of Letter: ${data.letterType}
    
    REFERENCE CONTENT (Use this as the basis for the specific details/content):
    "${data.referenceText}"

    INSTRUCTIONS:
    1. Use a formal government submission tone.
    2. Ensure the structure includes: Date, Recipient Details, Subject Line, Salutation, Introduction, Body (categorized if necessary), Conclusion, and Sign-off.
    3. Align the technical details with the selected category (${data.category}).
    4. If it's a "Research" type, emphasize evidence and data. If it's a "Request", be clear and polite about the "ask".
    5. The final output should be ready for submission with placeholders like [Date], [Name], [Title] if not provided.

    Draft the letter now:
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating letter:", error);
    throw new Error("Failed to generate letter. Please check your API key and network connection.");
  }
}
