"use client"

import { useEffect, useState, useCallback } from "react";
import TimerBar from "./timerBar";
import { useTimeStore } from "../store/time";
import getWordList from "../app/actions/getWordList";

const cursorKeyframes = `
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const cursorStyle = {
    animation: 'blink 1s step-end infinite',
    transition: 'all 0.03s linear', 
};

function getLines(words: string[], wordsPerLine: number): string[][] {
    const lines: string[][] = [];
    for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, Math.min(i + wordsPerLine, words.length)));
    }
    return lines;
}

export default function TypingTest() {
    const [visibleLines, setVisibleLines] = useState(3);
    const activeDuration = useTimeStore((state) => state.activeDuration);
    const [wordsList, setWordsList] = useState<string[]>([]);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [inputWord, setInputWord] = useState("");
    const [completedLetters, setCompletedLetters] = useState<string[]>([]);
    const [typedWordsHistory, setTypedWordsHistory] = useState<string[][]>(() => wordsList.map(() => []));
    const wordsPerLine = 13;

    useEffect(() => {
        async function fetch() {
            const words = await getWordList({ time: activeDuration });
            setWordsList(words);
            setTypedWordsHistory(words.map(() => []));
            setCurrentLetterIndex(0);
            setCurrentWordIdx(0);
            setInputWord("");
            setCompletedLetters([]);
            setVisibleLines(3);
        }
        fetch();
    }, [activeDuration]);

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

        const currentLine = Math.floor(currentWordIdx / wordsPerLine);
        if (currentLine >= visibleLines - 1) {
            setVisibleLines(prev => prev + 1);
        }
    
        setCompletedLetters([]);
        setInputWord("");
        setCurrentLetterIndex(0);
        setCurrentWordIdx(prev => prev + 1);
    }, [currentWordIdx, completedLetters, wordsList.length, visibleLines, wordsPerLine]);

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
                    className="absolute bottom-2 w-[2px] h-[1.1em] bg-teal-400"
                    style={{
                        ...cursorStyle,
                        left: `${currentLetterIndex}ch`,
                        transform: 'translateY(2px)', 
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
            <TimerBar />
            <div className="w-full max-w-[950px] py-20 mx-auto">
                <div className="relative mx-auto">
                    <div className="text-3xl leading-relaxed space-y-4">
                        {getLines(wordsList, wordsPerLine)
                            .slice(Math.max(0, Math.floor(currentWordIdx / wordsPerLine) - 1), 
                                   Math.max(3, Math.floor(currentWordIdx / wordsPerLine) + 2))
                            .map((line, lineIndex) => (
                                <div
                                    key={`line-${lineIndex}`}
                                    className="flex gap-2 justify-center" 
                                >
                                    {line.map((word, wordIndex) => {
                                        const globalWordIndex = 
                                            (Math.max(0, Math.floor(currentWordIdx / wordsPerLine) - 1) + lineIndex) 
                                            * wordsPerLine + wordIndex;
                                        
                                        if (globalWordIndex === currentWordIdx) {
                                            return renderCurrentWord();
                                        } else if (typedWordsHistory[globalWordIndex]?.length > 0 || 
                                                 globalWordIndex < currentWordIdx) {
                                            const attempt = typedWordsHistory[globalWordIndex] || [];
                                            return renderPreviouslyTypedWord(word, attempt, globalWordIndex);
                                        } else {
                                            return renderFutureWord(word, globalWordIndex);
                                        }
                                    })}
                                </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}