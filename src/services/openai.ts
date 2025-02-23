import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: { 'OpenAI-Project-Id': process.env.OPENAI_PROJECT_ID }
});

const getReading = async (prompt: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.NODE_ENV === 'production' ? "gpt-4" : "gpt-3.5-turbo", // Fix typo from "gpt-4o"
      messages: [
        { role: "system", content: `You are an experienced tarot reader with deep knowledge of the 78-card deck. Provide:
### Cards Drawn
[List the cards intuitively selected]

### Individual Interpretations
[Analyze each card's meaning]

### Cards Interaction
[Explain how the cards relate]

### Overall Message
[Provide guidance and insights]

Use clear, compassionate language and maintain proper markdown formatting.` },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    if (completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content) {
      return completion.choices[0].message.content.trim();
    } else {
      return 'No response received';
    }
  } catch (error: unknown) {
    console.error('OpenAI Error:', error);
    return `Reading generation failed: ${error}`;
  }
};

const getCompletion = async (prompt: string, systemPrompt: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.NODE_ENV === 'production' ? "gpt-4" : "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    if (completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content) {
      return completion.choices[0].message.content.trim();
    } else {
      return 'No response received';
    }
  } catch (error: unknown) {
    console.error('OpenAI Error:', error);
    return `Completion generation failed: ${error}`;
  }
};

const getEmbeddings = async (input: string | string[]) => {
  try {
    const embeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input
    });

    if (embeddings.data && embeddings.data.length > 0) {
      return embeddings.data.map(item => item.embedding);
    } else {
      return [];
    }
  } catch (error: unknown) {
    console.error("Error getting embeddings:", error);
    return [];
  }
};

export { getReading, getCompletion, getEmbeddings };
