"use client"

import { useEffect, useState } from "react";

const wordsList = ["hello", "world", "monkeytype", "is", "awesome", "javascript"];

export default function TypingTest() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");

  const currentWord = wordsList[currentWordIndex];
  const currentLetters = currentWord.split("");

  useEffect(() => {
    console.log("Effect re-ran. State:", { currentInput, currentWordIndex, currentLetterIndex, completedLetters });
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;

      if (key.length === 1) {
        e.preventDefault();
        handleLetter(key);
      } else if (key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (key === " " || key === "Enter") {
        e.preventDefault();
        handleWordSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      console.log("Cleaning up old keydown listener");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentInput, currentWordIndex, currentLetterIndex, completedLetters]);

  const handleLetter = (letter: string) => {
    if (currentLetterIndex < currentLetters.length) {
      setCurrentInput((prev) => {
        console.log("handleLetter: setCurrentInput", prev + letter);
        return prev + letter;
      });
      setCompletedLetters((prev) => {
        console.log("handleLetter: setCompletedLetters", [...prev, letter]);
        return [...prev, letter];
      });
      setCurrentLetterIndex((prev) => {
        console.log("handleLetter: setCurrentLetterIndex", prev + 1);
        return prev + 1;
      });
    }
  };

  const handleBackspace = () => {
    if (currentInput.length > 0) {
      setCurrentInput((prev) => {
        console.log("handleBackspace: setCurrentInput", prev.slice(0, -1));
        return prev.slice(0, -1);
      });
      setCompletedLetters((prev) => {
        console.log("handleBackspace: setCompletedLetters", prev.slice(0, -1));
        return prev.slice(0, -1);
      });
      setCurrentLetterIndex((prev) => {
        console.log("handleBackspace: setCurrentLetterIndex", Math.max(0, prev - 1));
        return Math.max(0, prev - 1);
      });
    }
  };

  const handleWordSubmit = () => {
    console.log("handleWordSubmit: before reset", { currentInput, completedLetters, currentLetterIndex, currentWordIndex });
    setCurrentInput("");
    setCompletedLetters([]);
    setCurrentLetterIndex(0);
    setCurrentWordIndex((prev) => {
      console.log("handleWordSubmit: setCurrentWordIndex", (prev + 1) % wordsList.length);
      return (prev + 1) % wordsList.length;
    });
     console.log("handleWordSubmit: after reset (state update is async, check next render logs)");
  };

  const renderCurrentWord = () => {
    const currentWord = wordsList[currentWordIndex];
    const currentLetters = currentWord.split("");

    console.log("renderCurrentWord: currentWordIndex", currentWordIndex, "completedLetters", completedLetters);

    return (
      <div key={currentWordIndex} className="flex items-center gap-1 mb-4">
        {currentLetters.map((char, idx) => {
          const inputChar = completedLetters[idx];
          let letterClass = "text-gray-600";

          if (inputChar === undefined) {
            letterClass = "text-gray-600";
          } else if (inputChar === char) {
            letterClass = "text-green-500";
          } else {
            letterClass = "text-red-500 underline";
          }
          console.log(`renderCurrentWord: wordIndex=${currentWordIndex}, charIndex=${idx}, char=${char}, inputChar=${inputChar}, letterClass=${letterClass}`);

          return (
            <span key={idx} className={`mr-1 ${letterClass}`}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const renderWord = (word: string, index: number) => {
    const isCompleted = index < currentWordIndex;
    console.log(`renderWord: word=${word}, index=${index}, isCompleted=${isCompleted}, class=${isCompleted ? "text-green-500" : "text-gray-600"}`);
    return (
      <span
        key={index}
        className={`mr-2 ${isCompleted ? "text-green-500" : "text-gray-600"}`}
      >
        {word}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-6 rounded-lg shadow-lg w-[600px]">
        <div className="flex flex-wrap text-xl mb-4 gap-2">
          {wordsList.map((word, index) => {
             console.log("Mapping wordsList:", { word, index, currentWordIndex });
             return index === currentWordIndex ? renderCurrentWord() : renderWord(word, index);
          })}
        </div>
      </div>
    </div>
  );
}