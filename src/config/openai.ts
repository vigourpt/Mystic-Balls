export const OPENAI_CONFIG = {
  apiKey: import.meta.env.OPENAI_API_KEY || '',
  model: 'gpt-4',  // Updated from 'gpt-4o'
  temperature: 0.7
};
