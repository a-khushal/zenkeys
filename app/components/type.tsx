"use client"

import { useEffect, useState, useCallback } from "react";

const wordsList = ["hello", "world", "zentype", "is", "awesome"];
const cursorKeyframes = `
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const cursorStyle = {
    animation: 'blink 1s step-end infinite',
};

export default function TypingTest() {
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [inputWord, setInputWord] = useState("");
    const [completedLetters, setCompletedLetters] = useState<string[]>([]);
    const [typedWordsHistory, setTypedWordsHistory] = useState<string[][]>(() => wordsList.map(() => []));

    const actualWord = wordsList[currentWordIdx] || "";

    const handleLetter = useCallback((letter: string) => {
        setInputWord((prev) => prev + letter);
        setCompletedLetters((prev) => [...prev, letter]);
        setCurrentLetterIndex((prev) => prev + 1);
    }, []);

    const handleBackspace = useCallback(() => {
        setInputWord((prev) => prev.slice(0, -1));
        setCompletedLetters((prev) => prev.slice(0, -1));
        setCurrentLetterIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const handleWordComplete = useCallback(() => {
        setTypedWordsHistory(prevHistory => {
            const newHistory = [...prevHistory];
            if (currentWordIdx < newHistory.length) {
                newHistory[currentWordIdx] = [...completedLetters];
            }
            return newHistory;
        });

        setCompletedLetters([]);
        setInputWord("");
        setCurrentLetterIndex(0);
        setCurrentWordIdx(prev => prev + 1);
    }, [currentWordIdx, completedLetters, wordsList.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const { key, ctrlKey, metaKey, altKey } = e;

            if (ctrlKey && key.toLowerCase() === "r") {
                return;
            }

            const currentActualWord = wordsList[currentWordIdx] || "";

            if (key === " ") {
                e.preventDefault();
                if (inputWord.length > 0 || completedLetters.length > 0 || currentActualWord ) {
                    handleWordComplete();
                }
            } else if (key.length === 1 && !ctrlKey && !metaKey && !altKey) {
                e.preventDefault();
                handleLetter(key);
            } else if (key === "Backspace") {
                e.preventDefault();
                handleBackspace();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [handleLetter, handleBackspace, handleWordComplete, currentWordIdx, inputWord, completedLetters, wordsList]);


    const renderCurrentWord = () => {
        const displayActualWord = wordsList[currentWordIdx] || "";

        return (
            <div
                key={`current-${currentWordIdx}`}
                className="flex items-center relative"
            >
                <style>{cursorKeyframes}</style>

                <div className="flex relative font-mono">
                    {displayActualWord.split("").map((char, idx) => {
                        const typedChar = completedLetters[idx];
                        let letterClass = "text-gray-600";

                        if (idx < completedLetters.length) {
                            letterClass = typedChar === char ? "dark:text-white text-black" : "text-red-500";
                        }

                        return (
                            <span 
                                key={`current-char-${idx}`} 
                                className={`${letterClass} w-[1ch]`}
                            >
                                {char}
                            </span>
                        );
                    })}
                </div>

                <div className="flex relative">
                    {completedLetters.slice(displayActualWord.length).map((extraChar, relIdx) => (
                        <span key={`extra-char-${relIdx}`} className="text-red-500">
                            {extraChar}
                        </span>
                    ))}
                </div>

                <span
                    className="absolute bottom-2 w-[2px] h-[1.1em] bg-yellow-600"
                    style={{
                        ...cursorStyle,
                        left: `${currentLetterIndex}ch`,
                        transition: 'left 0.1s ease-out',
                        transform: 'translateY(2px)'
                    }}
                />
            </div>
        );
    };

    const renderPreviouslyTypedWord = (wordToRender: string, typedAttempt: string[], wordIdx: number) => {
        const actualChars = wordToRender.split("");
        const hasError = typedAttempt.some((char, idx) => idx >= actualChars.length || char !== actualChars[idx]) ||
                        typedAttempt.length !== actualChars.length;

        return (
            <div key={`typed-${wordIdx}`} className={`flex items-center ${hasError ? "underline decoration-red-500 decoration-1" : ""}`}>
                {actualChars.map((char, charIdx) => {
                    const typedChar = typedAttempt[charIdx];
                    let letterClass = "";

                    if (typedChar === undefined) {
                        letterClass = "text-red-500";
                    } else if (typedChar === char) {
                        letterClass = "dark:text-white text-white";
                    } else {
                        letterClass = "text-red-500";
                    }
                    return (
                        <span key={`typed-char-${wordIdx}-${charIdx}`} className={letterClass}>
                            {char}
                        </span>
                    );
                })}
                {typedAttempt.slice(actualChars.length).map((extraChar, idx) => (
                    <span key={`typed-extra-${wordIdx}-${idx}`} className="text-red-500">
                        {extraChar}
                    </span>
                ))}
            </div>
        );
    };

    const renderFutureWord = (wordToRender: string, wordIdx: number) => {
        return (
            <div key={`future-${wordIdx}`} className="flex items-center font-mono">
                {wordToRender.split("").map((char, charIdx) => (
                    <span key={`future-char-${wordIdx}-${charIdx}`} className="text-gray-600">
                        {char}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 font-mono">
            <div className="p-6">
                <div className="flex flex-wrap text-2xl mb-4 gap-x-3 gap-y-2 leading-relaxed">
                    {wordsList.map((word, index) => {
                        if (index === currentWordIdx) {
                            return renderCurrentWord();
                        } else if (typedWordsHistory[index] && typedWordsHistory[index].length > 0 || (index < currentWordIdx && word.length > 0) ) {
                            const attempt = typedWordsHistory[index] || [];
                            return renderPreviouslyTypedWord(word, attempt, index);
                        } else {
                           return renderFutureWord(word, index);
                        }
                    })}
                </div>
            </div>
        </div>
    );
}