import { ReadingTypeId, ReadingType } from '../types';

// Validate required fields before making the request
const validateRequiredFields = (readingType: ReadingTypeId, userInput: Record<string, string>) => {
  const requiredFields: Record<ReadingTypeId, string[]> = {
    'tarot': ['question', 'spread'],
    'numerology': ['birthdate', 'fullname'],
    'astrology': ['birthdate', 'birthplace'],
    'oracle': ['question', 'deck'],
    'runes': ['question', 'spread'],
    'iching': ['question'],
    'angelnumbers': ['numbers'],
    'horoscope': ['zodiac'],
    'dreamanalysis': ['dream'],
    'magic8ball': ['question'],
    'aura': ['feelings'],
    'pastlife': ['concerns']
  };

  const missing = requiredFields[readingType]?.filter(field => !userInput[field]);
  if (missing?.length) {
    throw new Error(`Missing required fields for ${readingType} reading: ${missing.join(', ')}`);
  }
};

// Helper function to get or initialize device ID
const getOrInitDeviceId = (): string => {
  let deviceId = localStorage.getItem('device-id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('device-id', deviceId);
  }
  return deviceId;
};

export const getReading = async (
  readingType: ReadingType,
  userInput: Record<string, string>
): Promise<string> => {
  try {
    // Validate reading type and required fields
    if (!readingType || typeof readingType !== 'object' || !readingType.id) {
      throw new Error(`Invalid reading type: ${JSON.stringify(readingType)}`);
    }
    validateRequiredFields(readingType.id, userInput);

    console.log('Processing reading type:', readingType, 'with input:', userInput);
    
    // Get the access token from local storage
    const accessToken = localStorage.getItem('sb-access-token');
    const isAnonymous = !accessToken;
    const deviceId = getOrInitDeviceId();
    
    // Track anonymous readings in localStorage
    let anonymousReadingsUsed = 0;
    if (isAnonymous) {
      anonymousReadingsUsed = parseInt(localStorage.getItem('mysticballs_free_readings_used') || '0', 10);
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Only add authorization header if user is signed in
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Add readings count header for anonymous users
    if (isAnonymous) {
      headers['X-Readings-Used'] = anonymousReadingsUsed.toString();
    }

    // Make the API call
    const response = await fetch('/.netlify/functions/getReading', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        readingType: readingType.id,
        userInput,
        isAnonymous,
        anonymousReadingsUsed,
        deviceId
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API error:', data);
      throw new Error(data.error || 'Reading generation failed');
    }

    if (!data.reading) {
      console.error('No reading in response:', data);
      throw new Error('No reading generated');
    }

    return data.reading;
  } catch (error: any) {
    console.error('Error in getReading:', error);
    throw error;
  }
};
