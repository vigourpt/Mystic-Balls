export const OPENAI_CONFIG = {
  apiKey: localStorage.getItem('openai_api_key') || '',
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
};

export const setApiKey = (key: string) => {
  localStorage.setItem('openai_api_key', key);
};