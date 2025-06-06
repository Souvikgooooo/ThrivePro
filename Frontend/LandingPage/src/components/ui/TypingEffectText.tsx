import React, { useState, useEffect } from 'react';

interface TypingEffectTextProps {
  text: string;
  speed?: number;
  delay?: number;
}

const TypingEffectText: React.FC<TypingEffectTextProps> = ({ text, speed = 50, delay = 1000 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span className="font-semibold text-gray-700">{displayedText}</span>;
};

export default TypingEffectText;
