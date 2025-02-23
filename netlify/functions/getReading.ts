import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { rateLimiter } from './utils/rateLimiter';
import { createClient } from '@supabase/supabase-js';
import { supabaseClient } from '../../src/lib/supabaseClient';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: { 'OpenAI-Project-Id': process.env.OPENAI_PROJECT_ID }
});

const MAX_FREE_READINGS = 3;

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

const readingConfigs: Record<string, { maxTokens: number; temperature: number; systemPrompt: string }> = {
  'tarot': {
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: `You are an experienced tarot reader with deep knowledge of the 78-card deck. Provide:
### Cards Drawn
[List the cards intuitively selected]

### Individual Interpretations
[Analyze each card's meaning]

### Cards Interaction
[Explain how the cards relate]

### Overall Message
[Provide guidance and insights]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'numerology': {
    maxTokens: 800,
    temperature: 0.6,
    systemPrompt: `You are a skilled numerologist. Analyze the numerical patterns and provide:
### Life Path Number
[Calculate and interpret]

### Destiny Number
[Calculate and interpret]

### Soul Urge Number
[Calculate and interpret]

### Personality Number
[Calculate and interpret]

### Life Purpose
[Synthesize overall meaning]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'astrology': {
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: `You are an expert astrologer. Provide a detailed reading covering:
### Planetary Positions
[Detail current celestial alignments]

### Personal Influences
[Explain how these affect the individual]

### Key Life Areas
[Career, relationships, personal growth]

### Future Opportunities
[Upcoming favorable periods and potential challenges]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'oracle': {
    maxTokens: 800,
    temperature: 0.7,
    systemPrompt: `You are a mystic oracle reader. Based on the seeker's question, provide:
### Initial Insights
[Share immediate impressions]

### Card Messages
[Interpret the oracle cards drawn]

### Divine Guidance
[Offer spiritual advice]

### Action Steps
[Suggest practical next steps]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'dreamanalysis': {  // Changed from 'dream' to match the reading type ID
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: `You are a skilled dream interpreter. Analyze the dream and provide:
### Symbol Analysis
[Interpret key dream symbols]

### Emotional Context
[Explore feelings and meanings]

### Personal Significance
[Connect to dreamer's life]

### Guidance & Messages
[Offer insights and advice]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'aura': {
    maxTokens: 800,
    temperature: 0.7,
    systemPrompt: `You are an experienced aura reader. Provide insights into:
### Aura Colors
[Identify and interpret dominant colors]

### Energy Patterns
[Describe energy flow and blocks]

### Chakra Balance
[Assess major energy centers]

### Recommendations
[Suggest energy maintenance practices]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'runes': {
    maxTokens: 800,
    temperature: 0.7,
    systemPrompt: `You are a skilled rune reader versed in Norse wisdom. Provide:
### Runes Drawn
[List the runes selected]

### Individual Meanings
[Interpret each rune's significance]

### Combined Message
[Explain how runes work together]

### Practical Guidance
[Offer actionable wisdom]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'iching': {
    maxTokens: 1000,
    temperature: 0.6,
    systemPrompt: `You are a wise I-Ching interpreter. Provide:
### Hexagram Drawn
[Show and name the hexagram]

### Core Meaning
[Explain primary symbolism]

### Changing Lines
[Detail any changing lines]

### Guidance
[Share wisdom for the situation]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'horoscope': {
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: `You are an expert astrologer. Provide:
### Daily Overview
[General energy and influences]

### Love & Relationships
[Romantic and social insights]

### Career & Goals
[Professional guidance]

### Health & Wellness
[Physical and emotional wellbeing]

### Lucky Elements
[Favorable factors for today]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'pastlife': {
    maxTokens: 1000,
    temperature: 0.8,
    systemPrompt: `You are a past life reader. Create a narrative covering:
### Time Period & Location
[Historical context]

### Past Identity
[Key characteristics and role]

### Significant Events
[Important life experiences]

### Present Connections
[Links to current life]

### Soul Lessons
[Wisdom carried forward]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'angelnumbers': {
    maxTokens: 800,
    temperature: 0.7,
    systemPrompt: `You are an angel number interpreter. Provide a detailed interpretation that includes:
### Number Significance
[Explain the spiritual significance of the number sequence]

### Divine Message
[Share the angels' message]

### Spiritual Meaning
[Explain deeper spiritual implications]

### Practical Guidance
[Offer actionable steps or advice]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
  'magic8ball': {
    maxTokens: 100,
    temperature: 0.7,
    systemPrompt: `You are a mystical Magic 8 Ball oracle. Provide a clear, concise response in this format:

### The Magic 8 Ball Says
[Provide one of the classic Magic 8 Ball responses like "It is certain", "Ask again later", "Don't count on it", etc.]

### Mystical Insight
[A brief 1-2 sentence elaboration on the answer]

Use clear, compassionate language and maintain proper markdown formatting.`
  },
};

const handler: Handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event));
  try {
    // Apply rate limiting
    try {
      // Check OpenAI rate limit first
      const clientIp = 
        event.headers['client-ip'] ||
        event.headers['x-nf-client-connection-ip'] ||
        'unknown';

      if (rateLimiter.isRateLimited(clientIp)) {
        console.log('Rate limit exceeded for IP:', clientIp);
        return {
          statusCode: 429,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Retry-After': '60'
          },
          body: JSON.stringify({ 
            error: 'Too many requests. Please try again in 1 minute.',
            retryAfter: 60
          })
        };
      }
    } catch (error) {
      console.error('Rate limit error:', error);
      return {
        statusCode: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Retry-After': '60'
        },
        body: JSON.stringify({ 
          error: 'Rate limiting error occurred',
          retryAfter: 60
        })
      };
    }

    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        }
      };
    }

    if (event.httpMethod !== 'POST') {
      console.log('Method not allowed:', event.httpMethod);
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_PROJECT_ID) {
      console.error('OpenAI API key or project ID missing');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'OpenAI configuration missing' })
      };
    }

    try {
      const authHeader = event.headers.authorization;
      if (!authHeader) {
        console.error('Missing authorization header');
        throw new Error('Missing authorization header');
      }

      // Get user profile
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (authError || !user) {
        console.error('Supabase auth error:', authError);
        throw new Error('Unauthorized');
      }

      // Get user profile with readings count
      const { data: profile, error: profileError } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Supabase Profile Error:', profileError);
        throw new Error('Failed to get user profile');
      }

      // Fix the free readings check - ensure we start with correct initial values
      const currentReadingsCount = profile.readings_count || 0;
      const freeReadingsRemaining = profile.free_readings_remaining ?? MAX_FREE_READINGS;

      if (!profile.is_premium && freeReadingsRemaining <= 0) {
        console.log('Free trial ended for user:', user.id);
        return {
          statusCode: 402,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Retry-After': '60'
          },
          body: JSON.stringify({
            error: 'Free trial ended',
            message: 'You have used all your free readings. Please upgrade to continue.',
            requiresUpgrade: true
          })
        };
      }

      const { readingType, userInput } = JSON.parse(event.body || '{}');
      
      if (!readingType || !userInput) {
        console.error('Missing readingType or userInput');
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Missing required parameters' })
        };
      }

      // Input validation for specific reading types
      if (readingType === 'numerology' && (!userInput.fullname || !userInput.birthdate)) {
        console.error('Missing fullname or birthdate for numerology');
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Name and birthdate required for numerology' })
        };
      }

      if (readingType === 'oracle' && !userInput.question) {
        console.error('Missing question for oracle reading');
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Please provide a question for your oracle reading' })
        };
      }

      if (readingType === 'pastlife' && !userInput.concerns) {
        console.error('Missing concerns for pastlife');
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Name and time period required for past life reading' })
        };
      }

      const config = readingConfigs[readingType];
      if (!config) {
        console.error('Unsupported reading type:', readingType);
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: `Unsupported reading type: ${readingType}` })
        };
      }

      // Update prompts to match configurations
      const prompts: Record<string, string> = {
        'tarot': `Provide a tarot reading for this question: ${userInput.question}`,
        'numerology': `Analyze the numerological significance of ${userInput.fullname}, born on ${userInput.birthdate}`,
        'pastlife': `Explore past life connections for ${userInput.name}.

Recurring Experiences: ${userInput.recurringExperiences}

Fears and Attractions: ${userInput.fearsAndAttractions}

Natural Talents: ${userInput.naturalTalents}`,
        'magic8ball': `Respond to this question: ${userInput.question}`,
        'astrology': `Analyze the celestial influences for someone born on ${userInput.birthdate}${userInput.birthtime ? ` at ${userInput.birthtime}` : ''} in ${userInput.birthplace}`,
        'oracle': `Interpret the oracle cards for: ${userInput.question}`,
        'runes': `Cast the runes for: ${userInput.question}`,
        'iching': `Consult the I Ching regarding: ${userInput.question}`,
        'angelnumbers': `Interpret the significance of ${userInput.number} for ${userInput.name}`,
        'horoscope': `Provide a detailed horoscope for ${userInput.zodiac}`,
        'dreamanalysis': `Interpret this dream: ${userInput.dream}`, // Added dreamanalysis instead of 'dream'
        'aura': `Read the aura and energy based on current feelings: ${userInput.feelings}`,
// Remove duplicate 'aura' key since it was already defined above
      };

      const prompt = prompts[readingType];
      if (!prompt) {
        console.error('Missing prompt for reading type:', readingType);
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: `Missing prompt for reading type: ${readingType}` })
        };
      }

      const completion = await openai.chat.completions.create({
        model: process.env.NODE_ENV === 'production' ? "gpt-4" : "gpt-3.5-turbo", // Fix typo from "gpt-4o"
        messages: [
          { role: "system", content: config.systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      });

      // Update readings count for non-premium users
      if (!profile.is_premium) {
        const { error: updateError } = await supabaseClient
          .from('user_profiles')
          .update({
            readings_count: currentReadingsCount + 1,
            free_readings_remaining: freeReadingsRemaining - 1,
            last_reading_date: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Failed to update readings count:', updateError);
        }
      }

      const responseBody: { reading?: string; error?: string; readingsRemaining?: number | null } = { };

      if (completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content) {
          responseBody.reading = completion.choices[0].message.content.trim();
      } else {
          console.error('No response received from OpenAI');
          responseBody.error = 'No response received';
      }

      if (!profile.is_premium) {
          responseBody.readingsRemaining = freeReadingsRemaining - 1;
      } else {
          responseBody.readingsRemaining = null;
      }

      const statusCode = 200;
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };

      return {
        statusCode,
        headers,
        body: JSON.stringify(responseBody)
      };
    } catch (error: any) {
      console.error('Full OpenAI Error:', error);
      let errorMessage = 'Reading generation failed';
      let statusCode = 500;
      let retryAfter: string | undefined = undefined;
      if (error instanceof Error) {
        console.error('OpenAI Error:', {
          message: error.message,
          ...(error as any).code ? {code: (error as any).code} : {},
          ...(error as any).status ? {status: (error as any).status} : {},
          stack: error.stack
        });

        if (error.message.includes('API key')) {
          errorMessage = 'Invalid OpenAI API key';
        } else if (typeof (error as any).status === 'number' && (error as any).status === 429) {
          statusCode = 429;
          errorMessage = 'Too many requests - please try again later';
          retryAfter = '60';
        } else if (error.message.includes('rate limit')) {
          statusCode = 429;
          errorMessage = 'Too many requests - please try again later';
          retryAfter = '60';
        }
         else {
          errorMessage = error.message;
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };

      const responseBody: { error: string; retryAfter?: string } = { error: errorMessage };
      if (retryAfter) {
        responseBody.retryAfter = retryAfter;
        headers['Retry-After'] = retryAfter;
      }

      return {
        statusCode,
        headers,
        body: JSON.stringify(responseBody)
      };
    }
  } catch (error: unknown) {
    console.error('Outer error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An unexpected error occurred' })
    };
  }
};

// Clean up expired rate limit entries periodically
setInterval(() => {
  rateLimiter.cleanup();
}, 60000);

export { handler };
