import type { CSSProperties } from "react";
import type { KeyboardProfile } from "@/lib/keyboard-layout";

type KeyboardColorway = "light-gold" | "silver-frost" | "graphite";

type MechKeyboardProps = {
  pressedCodes: Set<string>;
  profile: KeyboardProfile;
  colorway: KeyboardColorway;
};

const KEY_UNIT = 42;
const KEY_GAP = 4;
const KEY_HEIGHT = 52;

const COLORWAY_STYLES: Record<
  KeyboardColorway,
  {
    caseClass: string;
    keyBorderClass: string;
    keyTopClass: string;
    keyTopPressedClass: string;
  }
> = {
  "light-gold": {
    caseClass:
      "border-[#c5b486] bg-[linear-gradient(180deg,#d9ca9f_0%,#cfbd8f_100%)] shadow-[0_6px_14px_rgba(0,0,0,0.22)]",
    keyBorderClass: "border-[#6e6a5e] bg-[#bdb69f]",
    keyTopClass:
      "border-[#969183] bg-[linear-gradient(180deg,#f3efe1_0%,#dfd8c2_100%)] text-[#403d37]",
    keyTopPressedClass:
      "translate-y-px border-[#70858c] bg-[linear-gradient(180deg,#d8e8eb_0%,#bfd5da_100%)] text-[#21383f]",
  },
  "silver-frost": {
    caseClass:
      "border-[#a5adb8] bg-[linear-gradient(180deg,#dde3ea_0%,#c7d0db_100%)] shadow-[0_6px_14px_rgba(0,0,0,0.18)]",
    keyBorderClass: "border-[#737b88] bg-[#b7beca]",
    keyTopClass:
      "border-[#9097a4] bg-[linear-gradient(180deg,#fbfcff_0%,#d9e0ea_100%)] text-[#2f3640]",
    keyTopPressedClass:
      "translate-y-px border-[#63849a] bg-[linear-gradient(180deg,#d9ebfc_0%,#bfd8f0_100%)] text-[#1b3548]",
  },
  graphite: {
    caseClass:
      "border-[#4d5662] bg-[linear-gradient(180deg,#525b6a_0%,#3f4753_100%)] shadow-[0_6px_14px_rgba(0,0,0,0.34)]",
    keyBorderClass: "border-[#8b93a0] bg-[#a7afbc]",
    keyTopClass:
      "border-[#8c95a3] bg-[linear-gradient(180deg,#d7dce3_0%,#bac2cf_100%)] text-[#252b33]",
    keyTopPressedClass:
      "translate-y-px border-[#6e8ea3] bg-[linear-gradient(180deg,#cde5f1_0%,#afcfdc_100%)] text-[#1b3646]",
  },
};

function getWidthPx(width = 1): string {
  const px = width * KEY_UNIT + (width - 1) * KEY_GAP;
  return `${px}px`;
}

export function MechKeyboard({ pressedCodes, profile, colorway }: MechKeyboardProps) {
  const tone = COLORWAY_STYLES[colorway];

  return (
    <section className="w-full overflow-x-auto px-1 pb-3">
      <div className={`mx-auto w-max rounded-[10px] border px-3 py-[14px] ${tone.caseClass}`}>
        {profile.rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="mb-1 flex items-center gap-1 last:mb-0">
            {row.map((item, itemIndex) => {
              if (item.type === "spacer") {
                return (
                  <div
                    key={`spacer-${rowIndex}-${itemIndex}`}
                    className="shrink-0"
                    style={{ width: getWidthPx(item.width), height: `${KEY_HEIGHT}px` }}
                  />
                );
              }

              const isPressed = pressedCodes.has(item.code);
              const keyStyle: CSSProperties = {
                width: getWidthPx(item.width),
                height: `${KEY_HEIGHT}px`,
              };
              const legendLayoutClass = item.subLabel
                ? "flex-col items-start justify-between"
                : "items-center justify-center";
              const legendTextClass = item.subLabel
                ? "block w-full overflow-hidden text-ellipsis whitespace-nowrap text-left"
                : "block text-center";

              return (
                <div key={`${item.code}-${rowIndex}-${itemIndex}`} className="shrink-0" style={keyStyle}>
                  <div
                    className={`h-full w-full rounded-[5px] border p-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.3)] ${tone.keyBorderClass}`}
                  >
                    <div
                      className={`h-full w-full rounded-[4px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_1px_rgba(0,0,0,0.18)] transition-all duration-75 ${tone.keyTopClass} ${isPressed ? tone.keyTopPressedClass : ""}`}
                    >
                      <div
                        className={`flex h-full w-full select-none px-[6px] py-[4px] text-[11px] font-medium leading-none tracking-[0.01em] ${legendLayoutClass}`}
                      >
                        {item.subLabel ? <span className={`opacity-[0.85] ${legendTextClass}`}>{item.subLabel}</span> : null}
                        <span className={legendTextClass}>{item.label || "\u00A0"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
