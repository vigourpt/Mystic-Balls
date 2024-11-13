import React from 'react';

interface Props {
  isDarkMode: boolean;
}

const ReadingTypeInfo: React.FC<Props> = ({ isDarkMode }) => {
  const readingInfo = [
    {
      title: "Tarot Reading",
      content: "Tarot readings use a deck of 78 cards, each rich with symbolism and meaning, to provide guidance and insight into life's questions. Dating back to the 15th century, tarot combines ancient wisdom with intuitive interpretation to illuminate paths forward, reveal hidden truths, and offer perspective on relationships, career decisions, and personal growth journeys."
    },
    {
      title: "Numerology Reading",
      content: "Numerology is the ancient study of numbers and their influence on human life. By analyzing your birth date and name, numerology reveals your life path number, destiny number, and soul urge number. These numerical patterns offer insights into your personality traits, life purpose, optimal career paths, and relationship compatibility."
    },
    {
      title: "Astrology Reading",
      content: "Astrology examines the positions of celestial bodies at the time of your birth to understand their influence on your life. Through analysis of your sun sign, moon sign, rising sign, and planetary aspects, astrology provides insights into your personality, relationships, career prospects, and life cycles. This ancient practice has guided decision-making for thousands of years."
    },
    {
      title: "Oracle Cards Reading",
      content: "Oracle cards offer divine guidance through beautifully illustrated cards, each carrying unique messages and meanings. Unlike tarot, oracle decks are more fluid and intuitive, making them accessible for both beginners and experienced readers. They provide clarity, inspiration, and guidance for life's questions and challenges."
    },
    {
      title: "Runes Reading",
      content: "Runes are ancient Norse symbols used for divination and guidance. Each of the 24 runes in the Elder Futhark system carries powerful meanings and energies. Rune readings offer insights into life situations, personal growth, and future possibilities, drawing upon centuries-old Nordic wisdom and mystical traditions."
    },
    {
      title: "I Ching Reading",
      content: "The I Ching, or 'Book of Changes,' is an ancient Chinese divination system with over 3,000 years of history. Through a process of casting hexagrams, the I Ching provides profound wisdom and guidance for life's questions. Each reading draws upon Taoist philosophy to offer insights into situations, relationships, and personal development."
    }
  ];

  return (
    <div className={`p-6 rounded-xl ${
      isDarkMode
        ? 'bg-indigo-900/30 backdrop-blur-sm'
        : 'bg-white/80 backdrop-blur-sm'
    } shadow-xl space-y-8`}>
      <h2 className={`text-2xl font-semibold mb-6 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Discover Our Reading Types
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {readingInfo.map((info, index) => (
          <article key={index} className="space-y-2">
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {info.title}
            </h3>
            <p className={`${
              isDarkMode ? 'text-indigo-200' : 'text-gray-600'
            } leading-relaxed`}>
              {info.content}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ReadingTypeInfo;