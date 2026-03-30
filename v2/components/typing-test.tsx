"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MechKeyboard } from "@/components/mech-keyboard";
import { KEYBOARD_PROFILES } from "@/lib/keyboard-layout";
import {
  createStaticWordBatch,
  createWordBatch,
  type TestDuration,
} from "@/lib/word-bank";

type KeyboardColorway = "light-gold" | "silver-frost" | "graphite";

const DEFAULT_DURATION: TestDuration = 60;
const INITIAL_WORDS = createStaticWordBatch(DEFAULT_DURATION);
const TIMER_OPTIONS: TestDuration[] = [15, 30, 60];

const SWITCH_OPTIONS = ["NovelKeys Creams", "Gateron Oil King", "Cherry MX Brown"];

const COLOR_OPTIONS: Array<{ id: KeyboardColorway; label: string }> = [
  { id: "light-gold", label: "Light Gold" },
  { id: "silver-frost", label: "Silver Frost" },
  { id: "graphite", label: "Graphite Gray" },
];

function getCorrectCharCount(expected: string, typed: string): number {
  const max = Math.min(expected.length, typed.length);
  let count = 0;

  for (let i = 0; i < max; i += 1) {
    if (expected[i] === typed[i]) {
      count += 1;
    }
  }

  return count;
}

function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function TypingTest() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [duration, setDuration] = useState<TestDuration>(DEFAULT_DURATION);
  const [words, setWords] = useState<string[]>(INITIAL_WORDS);
  const [attempts, setAttempts] = useState<string[]>(() => Array(INITIAL_WORDS.length).fill(""));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [pressedCodes, setPressedCodes] = useState<Set<string>>(() => new Set());

  const [switchPack, setSwitchPack] = useState(SWITCH_OPTIONS[0]);
  const [boardId, setBoardId] = useState(KEYBOARD_PROFILES[0].id);
  const [colorway, setColorway] = useState<KeyboardColorway>("light-gold");
  const [muted, setMuted] = useState(false);

  const activeProfile =
    KEYBOARD_PROFILES.find((profile) => profile.id === boardId) ?? KEYBOARD_PROFILES[0];

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const resetSession = useCallback(
    (nextDuration: TestDuration = duration) => {
      const nextWords = createWordBatch(nextDuration);

      setWords(nextWords);
      setAttempts(Array(nextWords.length).fill(""));
      setCurrentWordIndex(0);
      setCurrentInput("");
      setTimeLeft(nextDuration);
      setIsRunning(false);
      setTestEnded(false);
      setPressedCodes(new Set());

      requestAnimationFrame(focusInput);
    },
    [duration, focusInput],
  );

  const appendWords = useCallback(() => {
    const nextWords = createWordBatch(15);
    setWords((prev) => [...prev, ...nextWords]);
    setAttempts((prev) => [...prev, ...Array(nextWords.length).fill("")]);
  }, []);

  const completeCurrentWord = useCallback(() => {
    if (testEnded) {
      return;
    }

    if (!isRunning) {
      setIsRunning(true);
    }

    setAttempts((prev) => {
      const next = [...prev];
      next[currentWordIndex] = currentInput;
      return next;
    });

    if (currentWordIndex >= words.length - 10) {
      appendWords();
    }

    setCurrentWordIndex((prev) => prev + 1);
    setCurrentInput("");
  }, [appendWords, currentInput, currentWordIndex, isRunning, testEnded, words.length]);

  const cycleDuration = useCallback(() => {
    const current = TIMER_OPTIONS.indexOf(duration);
    const nextDuration = TIMER_OPTIONS[(current + 1) % TIMER_OPTIONS.length];
    setDuration(nextDuration);
    resetSession(nextDuration);
  }, [duration, resetSession]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    if (!isRunning || testEnded) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          setTestEnded(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isRunning, testEnded]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      setPressedCodes((prev) => {
        if (prev.has(event.code)) {
          return prev;
        }

        const next = new Set(prev);
        next.add(event.code);
        return next;
      });

      const target = event.target as HTMLElement | null;
      const insideInput = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      const insideSelect = target?.tagName === "SELECT";

      if (event.key === "Escape") {
        event.preventDefault();
        resetSession();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        focusInput();
        return;
      }

      if (testEnded && event.key === "Enter") {
        event.preventDefault();
        resetSession();
        return;
      }

      if (insideInput || insideSelect || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.length === 1 || event.key === "Backspace" || event.key === " ") {
        focusInput();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      setPressedCodes((prev) => {
        if (!prev.has(event.code)) {
          return prev;
        }

        const next = new Set(prev);
        next.delete(event.code);
        return next;
      });
    };

    const onBlur = () => {
      setPressedCodes(new Set());
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [focusInput, resetSession, testEnded]);

  const metrics = useMemo(() => {
    const elapsedSeconds = duration - timeLeft;
    const minutes = elapsedSeconds > 0 ? elapsedSeconds / 60 : 0;

    let typedChars = 0;
    let correctChars = 0;

    for (let i = 0; i < currentWordIndex; i += 1) {
      const expected = words[i] ?? "";
      const typed = attempts[i] ?? "";

      typedChars += typed.length;
      correctChars += getCorrectCharCount(expected, typed);
    }

    const currentWord = words[currentWordIndex] ?? "";
    typedChars += currentInput.length;
    correctChars += getCorrectCharCount(currentWord, currentInput);

    const wpm = minutes > 0 ? correctChars / 5 / minutes : 0;
    const accuracy = typedChars > 0 ? (correctChars / typedChars) * 100 : 100;

    return {
      wpm,
      accuracy,
    };
  }, [attempts, currentInput, currentWordIndex, duration, timeLeft, words]);

  const visibleStart = Math.max(0, currentWordIndex - 10);
  const visibleEnd = Math.min(words.length, currentWordIndex + 22);
  const visibleWords = words.slice(visibleStart, visibleEnd);

  return (
    <main className="min-h-screen w-full bg-[#ececec] text-[#1f1f1f]">
      <div className="mx-auto w-full max-w-[1120px] px-4 pb-12 pt-7 md:pt-[72px]">
        <section className="mx-auto mb-[18px] w-full max-w-[760px] border border-[#d2d2d2] bg-[#efefef] p-3">
          <div className="mb-3 min-h-[90px]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[20px] leading-[1.25] text-[#616161] md:text-[35px]">
              {visibleWords.map((word, offset) => {
                const index = visibleStart + offset;

                if (index < currentWordIndex) {
                  const typed = attempts[index] ?? "";
                  return (
                    <div key={`done-${index}`} className="inline-flex">
                      {word.split("").map((char, charIndex) => {
                        const typedChar = typed[charIndex];
                        const charClassName =
                          typedChar === undefined
                            ? "text-[#cf4545]"
                            : typedChar === char
                              ? "text-[#171717]"
                              : "text-[#cf4545]";

                        return (
                          <span key={`done-${index}-${charIndex}`} className={charClassName}>
                            {char}
                          </span>
                        );
                      })}
                      {typed
                        .slice(word.length)
                        .split("")
                        .map((extra, extraIndex) => (
                          <span key={`done-extra-${index}-${extraIndex}`} className="text-[#cf4545]">
                            {extra}
                          </span>
                        ))}
                    </div>
                  );
                }

                if (index === currentWordIndex) {
                  return (
                    <div key={`current-${index}`} className="inline-flex rounded-[2px] bg-[#d7d7d7] px-1">
                      {word.split("").map((char, charIndex) => {
                        const typedChar = currentInput[charIndex];
                        const charClassName =
                          typedChar === undefined
                            ? "text-[#171717]"
                            : typedChar === char
                              ? "text-[#171717]"
                              : "text-[#cf4545]";

                        return (
                          <span key={`current-${index}-${charIndex}`} className={charClassName}>
                            {char}
                          </span>
                        );
                      })}
                      {currentInput
                        .slice(word.length)
                        .split("")
                        .map((extra, extraIndex) => (
                          <span key={`current-extra-${index}-${extraIndex}`} className="text-[#cf4545]">
                            {extra}
                          </span>
                        ))}
                    </div>
                  );
                }

                return (
                  <span key={`future-${index}`} className="text-[#616161]">
                    {word}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={currentInput}
              onChange={(event) => {
                if (testEnded) {
                  return;
                }

                const value = event.target.value.replace(/\s+/g, "");

                if (!isRunning && value.length > 0) {
                  setIsRunning(true);
                }

                setCurrentInput(value);
              }}
              onKeyDown={(event) => {
                if (event.key === " ") {
                  event.preventDefault();
                  completeCurrentWord();
                  return;
                }

                if (event.key === "Tab") {
                  event.preventDefault();
                  return;
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  resetSession();
                  return;
                }

                if (event.key === "Enter") {
                  event.preventDefault();
                  if (testEnded) {
                    resetSession();
                  } else {
                    completeCurrentWord();
                  }
                }
              }}
              className="h-11 flex-1 border border-[#272727] bg-white px-[10px] text-[22px] leading-none text-[#111111] outline-none focus:shadow-[0_0_0_2px_rgba(0,0,0,0.05)] md:text-[34px]"
              autoComplete="off"
              spellCheck={false}
              aria-label="Typing input"
            />

            <button
              type="button"
              onClick={cycleDuration}
              className="h-11 min-w-[54px] cursor-pointer border border-[#111111] bg-black px-[10px] text-sm text-white"
              title="Change timer"
            >
              {formatClock(timeLeft)}
            </button>

            <button
              type="button"
              onClick={() => resetSession()}
              className="h-11 cursor-pointer border border-[#ababab] bg-[#e9e9e9] px-[10px] text-sm text-[#222222]"
            >
              Redo
            </button>
          </div>
        </section>

        <section className="mx-auto mb-5 w-full max-w-[760px] border border-[#d2d2d2] bg-[#efefef] p-3">
          <div className="flex flex-wrap items-center gap-[10px]">
            <select
              value={switchPack}
              onChange={(event) => setSwitchPack(event.target.value)}
              className="h-[42px] min-w-[178px] border border-[#b8b8b8] bg-[#f5f5f5] px-3 text-[16px] text-[#222222] md:text-[20px]"
            >
              {SWITCH_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={boardId}
              onChange={(event) => setBoardId(event.target.value)}
              className="h-[42px] min-w-[178px] border border-[#b8b8b8] bg-[#f5f5f5] px-3 text-[16px] text-[#222222] md:text-[20px]"
            >
              {KEYBOARD_PROFILES.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>

            <select
              value={colorway}
              onChange={(event) => setColorway(event.target.value as KeyboardColorway)}
              className="h-[42px] min-w-[178px] border border-[#b8b8b8] bg-[#f5f5f5] px-3 text-[16px] text-[#222222] md:text-[20px]"
            >
              {COLOR_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <label className="ml-0 inline-flex items-center gap-1.5 text-[16px] text-[#3a3a3a] md:ml-auto md:text-[20px]">
              <input
                type="checkbox"
                checked={muted}
                onChange={(event) => setMuted(event.target.checked)}
                className="h-4 w-4"
              />
              Mute
            </label>
          </div>

          <p className="mt-2 text-[15px] text-[#565656] md:text-[19px]">
            {testEnded
              ? `Done - ${Math.round(metrics.wpm)} WPM, ${metrics.accuracy.toFixed(1)}% accuracy.`
              : `${Math.round(metrics.wpm)} WPM | ${metrics.accuracy.toFixed(1)}% accuracy | ${muted ? "Muted" : switchPack}`}
          </p>
        </section>

        <MechKeyboard pressedCodes={pressedCodes} profile={activeProfile} colorway={colorway} />
      </div>
    </main>
  );
}
