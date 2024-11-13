import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../config/openai';

let openai: OpenAI | null = null;

export const initializeOpenAI = () => {
  if (!OPENAI_CONFIG.apiKey) return null;
  
  openai = new OpenAI({
    apiKey: OPENAI_CONFIG.apiKey,
    dangerouslyAllowBrowser: true
  });
  
  return openai;
};

const formatResponse = (text: string): string => {
  // Add extra newline before headers
  text = text.replace(/\n(#{1,3})/g, '\n\n$1');
  
  // Add extra newline between paragraphs
  text = text.replace(/\n\n/g, '\n\n\n');
  
  // Ensure consistent spacing around sections
  text = text.replace(/\n{4,}/g, '\n\n\n');
  
  return text;
};

export const getReading = async (
  readingType: string,
  userInput: Record<string, string>
): Promise<string> => {
  if (!openai) {
    openai = initializeOpenAI();
    if (!openai) throw new Error('OpenAI API key not set');
  }

  const prompts: Record<string, string> = {
    numerology: `As a numerology expert, provide an insightful reading for ${userInput.name}, born on ${userInput.birthdate}. Focus only on the meaningful interpretations of their Life Path Number, Destiny Number, and Soul Urge Number. Skip all calculations and technical details. Provide the insights in a clear, engaging way that focuses on personality traits, life purpose, and potential. Keep the response concise and meaningful. Use markdown headers (###) for each section, and ensure paragraphs are well-separated.`,
    tarot: `As a tarot reader, provide an insightful interpretation for this question: ${userInput.question}. Draw three cards and focus only on their meaning and guidance in context. Skip technical details about the cards' positions or systems. Keep the reading engaging and practical. Use markdown headers (###) for each card's section, and ensure paragraphs are well-separated.`,
    astrology: `As an astrologer, provide an insightful reading for someone born on ${userInput.birthdate}${userInput.birthTime ? ` at ${userInput.birthTime}` : ''}${userInput.location ? ` in ${userInput.location}` : ''}. Focus on personality traits, life path, and current influences. Skip technical aspects and focus on practical insights and guidance. Use markdown headers (###) for each section, and ensure paragraphs are well-separated.`,
    oracle: `As an oracle card reader, provide clear guidance for this question: ${userInput.question}. Draw three cards and focus only on their message and meaning for the querent. Keep the interpretation practical and actionable. Use markdown headers (###) for each card's section, and ensure paragraphs are well-separated.`,
    runes: `As a rune caster, provide clear guidance for this question: ${userInput.question}. Cast three runes and focus only on their message and practical meaning for the situation. Skip technical details about the runes themselves. Use markdown headers (###) for each rune's section, and ensure paragraphs are well-separated.`,
    iching: `As an I Ching expert, provide clear guidance for this question: ${userInput.question}. Focus only on the practical interpretation and wisdom for the situation. Skip technical details about hexagram numbers and structure. Use markdown headers (###) for each section, and ensure paragraphs are well-separated.`
  };

  const response = await openai.chat.completions.create({
    model: OPENAI_CONFIG.model,
    messages: [
      {
        role: 'system',
        content: 'You are a wise and insightful mystic who provides clear, practical guidance. Focus on meaningful insights and skip technical details. Keep responses concise yet profound, and always maintain a supportive and encouraging tone. Use markdown formatting with ### for section headers, and ensure proper spacing between paragraphs and sections.'
      },
      {
        role: 'user',
        content: prompts[readingType]
      }
    ],
    temperature: OPENAI_CONFIG.temperature,
  });

  const content = response.choices[0].message.content || 'Unable to generate reading';
  return formatResponse(content);
};