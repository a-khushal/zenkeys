"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MechKeyboard } from "@/components/mech-keyboard";
import { KEYBOARD_PROFILES } from "@/lib/keyboard-layout";
import {
  createStaticWordBatch,
  createWordBatch,
  type TestDuration,
} from "@/lib/word-bank";

const DEFAULT_DURATION: TestDuration = 60;
const INITIAL_WORDS = createStaticWordBatch(DEFAULT_DURATION);
const TIMER_OPTIONS: TestDuration[] = [15, 30, 60];

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
  const wordsViewportRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState<TestDuration>(DEFAULT_DURATION);
  const [words, setWords] = useState<string[]>(INITIAL_WORDS);
  const [attempts, setAttempts] = useState<string[]>(() => Array(INITIAL_WORDS.length).fill(""));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [pressedCodes, setPressedCodes] = useState<Set<string>>(() => new Set());
  const [lineStarts, setLineStarts] = useState<number[]>([0]);

  const [boardId, setBoardId] = useState(KEYBOARD_PROFILES[0].id);
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

  const selectDuration = useCallback(
    (nextDuration: TestDuration) => {
      setDuration(nextDuration);
      resetSession(nextDuration);
    },
    [resetSession],
  );

  const recalculateLineStarts = useCallback(() => {
    const viewport = wordsViewportRef.current;
    if (!viewport || words.length === 0) {
      setLineStarts([0]);
      return;
    }

    const maxWidth = viewport.clientWidth;
    if (maxWidth <= 0) {
      return;
    }

    const style = window.getComputedStyle(viewport);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const spaceWidth = context.measureText(" ").width;
    const starts: number[] = [0];
    let lineWidth = 0;

    for (let i = 0; i < words.length; i += 1) {
      const wordWidth = context.measureText(words[i]).width;
      const nextWidth = lineWidth === 0 ? wordWidth : lineWidth + spaceWidth + wordWidth;

      if (nextWidth > maxWidth && lineWidth > 0) {
        starts.push(i);
        lineWidth = wordWidth;
      } else {
        lineWidth = nextWidth;
      }
    }

    setLineStarts(starts);
  }, [words]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      recalculateLineStarts();
    });

    const viewport = wordsViewportRef.current;
    if (!viewport) {
      window.cancelAnimationFrame(frameId);
      return;
    }

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        recalculateLineStarts();
      });
    });
    observer.observe(viewport);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [recalculateLineStarts]);

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

  const visibleWindow = useMemo(() => {
    if (lineStarts.length === 0) {
      return { startWordIndex: 0, endWordIndex: Math.min(words.length, 40) };
    }

    let currentLine = 0;
    for (let i = 0; i < lineStarts.length; i += 1) {
      if (lineStarts[i] <= currentWordIndex) {
        currentLine = i;
      } else {
        break;
      }
    }

    const maxStartLine = Math.max(0, lineStarts.length - 3);
    const startLine = Math.min(currentLine, maxStartLine);
    const endLineExclusive = Math.min(startLine + 3, lineStarts.length);
    const startWordIndex = lineStarts[startLine] ?? 0;
    const endWordIndex = lineStarts[endLineExclusive] ?? words.length;

    return { startWordIndex, endWordIndex };
  }, [currentWordIndex, lineStarts, words.length]);

  const visibleWords = words.slice(visibleWindow.startWordIndex, visibleWindow.endWordIndex);

  return (
    <main className="min-h-screen w-full bg-[#ececec] text-[#1f1f1f]">
      <div className="mx-auto w-full max-w-[1100px] px-4 pb-12 pt-8 md:pt-10">
        <section className="mx-auto mb-4 w-full max-w-[900px] rounded-[8px] border border-[#cccccc] bg-[#efefef] p-3">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-[6px] border border-[#b7b7b7] bg-[#e4e4e4] p-1">
              {TIMER_OPTIONS.map((option) => {
                const active = option === duration;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectDuration(option)}
                    className={`h-8 min-w-[54px] rounded-[4px] border px-3 text-sm font-medium transition ${active ? "border-[#1f1f1f] bg-[#222222] text-white" : "border-transparent bg-transparent text-[#2d2d2d] hover:border-[#bdbdbd] hover:bg-[#ededed]"}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="ml-auto inline-flex h-9 items-center rounded-[4px] border border-[#101010] bg-[#111111] px-3 text-sm font-medium text-[#f5f5f5]">
              {formatClock(timeLeft)}
            </div>
            <button
              type="button"
              onClick={() => resetSession()}
              className="h-9 rounded-[4px] border border-[#a7a7a7] bg-[#e7e7e7] px-3 text-sm font-medium text-[#232323] transition hover:bg-[#dddddd]"
            >
              Redo
            </button>
          </div>

          <div className="rounded-[6px] border border-[#c8c8c8] bg-[#f4f4f4] p-3">
            <div className="h-[82px] overflow-hidden md:h-[126px]">
              <div
                ref={wordsViewportRef}
                className="flex h-full flex-wrap content-start items-start gap-x-3 gap-y-1 text-[20px] leading-[1.25] text-[#666666] md:text-[34px]"
              >
              {visibleWords.map((word, offset) => {
                const index = visibleWindow.startWordIndex + offset;

                if (index < currentWordIndex) {
                  const typed = attempts[index] ?? "";
                  return (
                    <div key={`done-${index}`} className="inline-flex">
                      {word.split("").map((char, charIndex) => {
                        const typedChar = typed[charIndex];
                        const charClassName =
                          typedChar === undefined
                            ? "text-[#cc4b4b]"
                            : typedChar === char
                              ? "text-[#1b1b1b]"
                              : "text-[#cc4b4b]";

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
                          <span key={`done-extra-${index}-${extraIndex}`} className="text-[#cc4b4b]">
                            {extra}
                          </span>
                        ))}
                    </div>
                  );
                }

                if (index === currentWordIndex) {
                  return (
                    <div
                      key={`current-${index}`}
                      className="inline-flex rounded-[3px] bg-[#d8d8d8] text-[#111111]"
                    >
                      {word.split("").map((char, charIndex) => {
                        const typedChar = currentInput[charIndex];
                        const charClassName =
                          typedChar === undefined
                            ? "text-[#111111]"
                            : typedChar === char
                              ? "text-[#111111]"
                              : "text-[#c74242]";

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
                          <span key={`current-extra-${index}-${extraIndex}`} className="text-[#c74242]">
                            {extra}
                          </span>
                        ))}
                    </div>
                  );
                }

                return (
                  <span key={`future-${index}`} className="text-[#666666]">
                    {word}
                  </span>
                );
              })}
              </div>
            </div>

            <div className="mt-3 rounded-[6px] border border-[#b9b9b9] bg-[#e9e9e9] p-2">
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
                className="h-14 w-full rounded-[4px] border border-[#262626] bg-white px-3 text-[24px] leading-none text-[#111111] outline-none focus:border-[#111111] focus:shadow-[0_0_0_1px_rgba(0,0,0,0.12)] md:text-[34px]"
                autoComplete="off"
                spellCheck={false}
                aria-label="Typing input"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto mb-5 w-full max-w-[900px] rounded-[8px] border border-[#cccccc] bg-[#efefef] p-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={boardId}
              onChange={(event) => setBoardId(event.target.value)}
              className="h-[42px] min-w-[178px] rounded-[4px] border border-[#b7b7b7] bg-[#f5f5f5] px-3 text-[14px] text-[#1f1f1f] md:min-w-[340px] md:text-[16px]"
            >
              {KEYBOARD_PROFILES.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>

            <label className="ml-0 inline-flex h-[42px] items-center gap-2 rounded-[4px] border border-[#b7b7b7] bg-[#f5f5f5] px-3 text-[14px] font-medium text-[#2f2f2f] md:ml-auto md:text-[15px]">
              <input
                type="checkbox"
                checked={muted}
                onChange={(event) => setMuted(event.target.checked)}
                className="h-4 w-4"
              />
              Mute
            </label>
          </div>

          <p className="mt-2 text-[14px] text-[#555555] md:text-[16px]">
            {testEnded
              ? `Done - ${Math.round(metrics.wpm)} WPM, ${metrics.accuracy.toFixed(1)}% accuracy.`
              : `${Math.round(metrics.wpm)} WPM | ${metrics.accuracy.toFixed(1)}% accuracy | ${muted ? "Muted" : "Sound On"}`}
          </p>
        </section>

        <MechKeyboard pressedCodes={pressedCodes} profile={activeProfile} />
      </div>
    </main>
  );
}
