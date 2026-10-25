import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

export async function generateSubtasks(taskTitle: string): Promise<string[]> {
  // אם אין מפתח API תקף, נחזיר תשובת דמו מובנית כדי שהפיתוח ימשיך חלק
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_actual_api_key_here') {
    console.log('⚠️ No valid ANTHROPIC_API_KEY found. Returning mock AI subtasks.');
    return [
      `Break down "${taskTitle}" into setup steps`,
      `Implement core logic for "${taskTitle}"`,
      `Test and verify "${taskTitle}"`
    ];
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `You are an expert developer assistant. Break down the following task into 3 clear, actionable sub-tasks. Return ONLY a JSON array of strings, nothing else. Task: "${taskTitle}"`,
        },
      ],
    });

    const contentBlock = response.content[0];
    if (contentBlock.type === 'text') {
      return JSON.parse(contentBlock.text);
    }
    
    return [];
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw new Error('Failed to generate subtasks from AI');
  }
}