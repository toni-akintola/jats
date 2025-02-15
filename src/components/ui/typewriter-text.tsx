"use client";
import { useEffect, useState } from "react";

interface TypewriterTextProps {
  messages: string[];
  typingSpeed?: number;
  delayBetweenMessages?: number;
}

export function TypewriterText({
  messages,
  typingSpeed = 50,
  delayBetweenMessages = 1000,
}: TypewriterTextProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentMessageIndex >= messages.length) return;

    const message = messages[currentMessageIndex];
    if (isTyping && currentText.length < message.length) {
      const timeoutId = setTimeout(() => {
        setCurrentText(message.slice(0, currentText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeoutId);
    }

    if (isTyping && currentText.length === message.length) {
      const timeoutId = setTimeout(() => {
        setIsTyping(false);
      }, delayBetweenMessages);
      return () => clearTimeout(timeoutId);
    }

    if (!isTyping) {
      const timeoutId = setTimeout(() => {
        setCurrentMessageIndex((i) => i + 1);
        setCurrentText("");
        setIsTyping(true);
      }, typingSpeed);
      return () => clearTimeout(timeoutId);
    }
  }, [
    currentText,
    currentMessageIndex,
    isTyping,
    messages,
    typingSpeed,
    delayBetweenMessages,
  ]);

  return (
    <div className="font-mono">
      {currentText}
      <span className="animate-pulse">▋</span>
    </div>
  );
}
