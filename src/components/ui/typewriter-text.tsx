"use client";
import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 30,
  startDelay = 0,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setHasStarted(false);
  }, [text]);

  useEffect(() => {
    if (!hasStarted) {
      const timeout = setTimeout(() => {
        setHasStarted(true);
      }, startDelay);
      return () => clearTimeout(timeout);
    }
  }, [hasStarted, startDelay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, hasStarted, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-1 h-4 bg-primary animate-pulse" />
      )}
    </span>
  );
}
