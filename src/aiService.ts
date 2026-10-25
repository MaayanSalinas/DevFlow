import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// שליפת המפתח מקובץ ה-env
const apiKey = process.env.GEMINI_API_KEY;

// בדיקה אם המפתח קיים כדי למנוע נפילה מראש
if (!apiKey) {
  console.error('⚠️ GEMINI_API_KEY is missing in .env file!');
}

const ai = new GoogleGenAI({ apiKey });

export async function generateSubtasks(taskTitle: string): Promise<string[]> {
  try {
    const prompt = `Break down the following task into 3-4 actionable, concise subtasks. 
    Task: "${taskTitle}"
    Return ONLY a raw JSON array of strings, without markdown formatting or code blocks.
    Example output format: ["Subtask 1", "Subtask 2", "Subtask 3"]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    
    // ניקוי תגיות Markdown במידה וה-AI החזיר אותן
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error generating subtasks with Gemini:', error);
    // תגובת ברירת מחדל במידה ותקשורת ה-AI נכשלה
    return [
      `Break down "${taskTitle}" into setup steps`,
      `Implement core logic for "${taskTitle}"`,
      `Test and verify "${taskTitle}"`,
    ];
  }
}