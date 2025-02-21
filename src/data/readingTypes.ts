import { 
  BookOpen,
  Calculator,
  Dice5,
  Hash,
  Layout,
  Moon,
  Sparkles,
  Star,
  Sun,
  Zap
} from 'lucide-react';
import { ReadingType } from '../types';
import { GiSpellBook } from 'react-icons/gi';  // Change to GiSpellBook which exists

export const READING_TYPES: ReadingType[] = [
  {
    id: 'tarot',
    title: 'Tarot Reading',  // Change name to title
    description: 'Discover insights through the ancient wisdom of tarot cards',
    icon: Layout,
    fields: [
      {
        name: 'question',
        type: 'text',
        label: 'Your Question',
        displayName: 'What would you like to know?',
        placeholder: 'Enter your question...',
        required: true
      },
      {
        name: 'spread',
        type: 'select',
        label: 'Spread Type',
        displayName: 'Choose your spread',
        required: true,
        options: [
          'Three Card',
          'Celtic Cross',
          'Past Life',
          'Career Path',
          'Love Reading'
        ]
      }
    ]
  },
  {
    id: 'numerology',
    title: 'Numerology Reading',  // Change name to title
    description: 'Unlock the meaning behind your personal numbers',
    icon: Calculator,
    fields: [
      {
        name: 'birthdate',
        type: 'date',
        label: 'Birth Date',
        displayName: 'Your birth date',
        required: true
      },
      {
        name: 'fullname',
        type: 'text',
        label: 'Full Name',
        displayName: 'Your full name at birth',
        placeholder: 'Enter your full name...',
        required: true
      }
    ]
  },
  {
    id: 'astrology',
    title: 'Astrology Reading',  // Change name to title
    description: 'Explore your celestial connections and cosmic path',
    icon: Star,
    fields: [
      {
        name: 'birthdate',
        type: 'date',
        label: 'Birth Date',
        displayName: 'Your birth date',
        required: true
      },
      {
        name: 'birthtime',
        type: 'text',
        label: 'Birth Time',
        displayName: 'Your birth time (if known)',
        placeholder: 'e.g., 14:30',
        required: false
      },
      {
        name: 'birthplace',
        type: 'text',
        label: 'Birth Place',
        displayName: 'Your birth place',
        placeholder: 'City, Country',
        required: true
      }
    ]
  },
  {
    id: 'oracle',
    title: 'Oracle Card Reading',  // Change name to title
    description: 'Receive guidance through mystical oracle messages',
    icon: Sparkles,
    fields: [
      {
        name: 'question',
        type: 'text',
        label: 'Your Question',
        displayName: 'What would you like guidance on?',
        placeholder: 'Enter your question...',
        required: true
      },
      {
        name: 'deck',
        type: 'select',
        label: 'Oracle Deck',
        displayName: 'Choose your deck',
        required: true,
        options: [
          'Angel Oracle',
          'Spirit Animal Oracle',
          'Goddess Oracle',
          'Crystal Oracle',
          'Chakra Wisdom'
        ]
      }
    ]
  },
  {
    id: 'runes',
    title: 'Rune Reading',  // Changed from name to title
    description: 'Ancient Norse wisdom for modern guidance',
    icon: Dice5,
    fields: [
      {
        name: 'question',
        type: 'text',
        label: 'Your Question',
        displayName: 'What would you like to know?',
        placeholder: 'Enter your question...',
        required: true
      },
      {
        name: 'spread',
        type: 'select',
        label: 'Rune Spread',
        displayName: 'Choose your spread',
        required: true,
        options: [
          'Single Rune',
          'Three Rune',
          'Five Rune',
          'Rune Cross'
        ]
      }
    ]
  },
  {
    id: 'iching',
    title: 'I Ching Reading',  // Changed from name to title
    description: 'Connect with ancient Chinese divination wisdom',
    icon: BookOpen,
    fields: [
      {
        name: 'question',
        type: 'text',
        label: 'Your Question',
        displayName: 'What would you like guidance on?',
        placeholder: 'Enter your question...',
        required: true
      }
    ]
  },
  {
    id: 'angelnumbers',
    title: 'Angel Numbers',  // Changed from name to title
    description: 'Decode divine messages in recurring numbers',
    icon: Hash,
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Your Name',
        displayName: 'Your Name',
        placeholder: 'Enter your name',
        required: true
      },
      {
        name: 'number',
        type: 'text',
        label: 'Number Sequence',
        displayName: 'What numbers do you keep seeing?',
        placeholder: 'e.g., 111, 222, 333...',
        required: true
      }
    ]
  },
  {
    id: 'horoscope',
    title: 'Daily Horoscope',  // Changed from name to title
    description: 'Your personalized daily celestial guidance',
    icon: Sun,
    fields: [
      {
        name: 'zodiac',
        type: 'select',
        label: 'Zodiac Sign',
        displayName: 'Your Zodiac Sign',
        required: true,
        options: [
          'Aries', 'Taurus', 'Gemini', 'Cancer', 
          'Leo', 'Virgo', 'Libra', 'Scorpio', 
          'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ]
      }
    ]
  },
  {
    id: 'dreamanalysis',
    title: 'Dream Analysis',
    description: 'Uncover the hidden meanings in your dreams',
    icon: Moon,
    fields: [
      {
        name: 'dream',  // Changed from 'dreamDescription' to match validation
        type: 'textarea',
        label: 'Dream Description',
        displayName: 'Tell us about your dream',
        placeholder: 'Please describe your dream in detail, including any symbols, feelings, or memorable elements that stood out to you...',
        required: true
      }
    ]
  },
  {
    id: 'magic8ball',
    title: 'Magic 8 Ball',  // Changed from name to title
    description: 'Quick answers to yes/no questions',
    icon: Dice5,
    fields: [
      {
        name: 'question',
        type: 'text',
        label: 'Your Question',
        displayName: 'Ask a Yes/No Question',
        placeholder: 'Enter your question...',
        required: true
      }
    ]
  },
  {
    id: 'aura',
    title: 'Aura Reading',  // Changed from name to title
    description: 'Discover your energy field\'s colors and meanings',
    icon: Zap,
    fields: [
      {
        name: 'feelings',
        type: 'textarea',
        label: 'Current Feelings',
        displayName: 'How are you feeling right now?',
        placeholder: 'Describe your current emotional and physical state...',
        required: true
      }
    ]
  },
  {
    id: 'pastlife',
    title: 'Past Life Reading',
    description: "Let's imagine your past life! Share your experiences and we'll explore the echoes of your previous incarnations.",
    icon: GiSpellBook,
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Your Name',
        displayName: 'Your Name',
        placeholder: 'Enter your full name...',
        required: true
      },
      {
        name: 'recurringExperiences',
        type: 'textarea',
        label: 'Recurring Dreams or Experiences',
        displayName: 'Tell us about your recurring dreams or experiences',
        placeholder: 'Share any recurring dreams, déjà vu moments, or unexplained memories that feel significant to you...',
        required: true
      },
      {
        name: 'fearsAndAttractions',
        type: 'textarea',
        label: 'Unexplained Fears and Attractions',
        displayName: 'What are your unexplained fears or strong attractions?',
        placeholder: 'Describe any intense fears or attractions that have no clear origin in your current life (e.g., fear of water, fascination with a particular culture or time period)...',
        required: true
      },
      {
        name: 'naturalTalents',
        type: 'textarea',
        label: 'Natural Abilities',
        displayName: 'What skills or abilities come naturally to you?',
        placeholder: 'Describe any skills, talents, or knowledge that you picked up unusually quickly or seem to have known instinctively...',
        required: true
      }
    ]
  }
];
