import type { CSSProperties } from "react";
import type { KeyboardProfile, KeyVariant } from "@/lib/keyboard-layout";

type MechKeyboardProps = {
  pressedCodes: Set<string>;
  profile: KeyboardProfile;
};

const KEY_UNIT = 48;
const KEY_GAP = 5;
const KEY_HEIGHT = 58;

const KEY_VARIANT_CLASSES: Record<
  KeyVariant,
  {
    frame: string;
    cap: string;
    pressedCap: string;
  }
> = {
  normal: {
    frame: "border-[#1c2127] bg-[linear-gradient(180deg,#2b3138_0%,#1f252c_100%)]",
    cap: "border-[#4a5058] bg-[linear-gradient(180deg,#5f666e_0%,#4d545c_100%)] text-[#dbe0e6] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-5px_8px_rgba(0,0,0,0.2)]",
    pressedCap:
      "border-[#565e68] bg-[linear-gradient(180deg,#58606a_0%,#474f58_100%)] text-[#f0f3f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-4px_7px_rgba(0,0,0,0.2)]",
  },
  modifier: {
    frame: "border-[#222831] bg-[linear-gradient(180deg,#394049_0%,#2c333b_100%)]",
    cap: "border-[#666d76] bg-[linear-gradient(180deg,#9098a1_0%,#737b84_100%)] text-[#f2f5f8] shadow-[inset_0_1px_0_rgba(255,255,255,0.11),inset_0_-5px_8px_rgba(0,0,0,0.16)]",
    pressedCap:
      "border-[#707985] bg-[linear-gradient(180deg,#858e98_0%,#69727c_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-4px_7px_rgba(0,0,0,0.14)]",
  },
  accent: {
    frame: "border-[#53180f] bg-[linear-gradient(180deg,#7c2415_0%,#5e1b10_100%)]",
    cap: "border-[#aa321c] bg-[linear-gradient(180deg,#ff6739_0%,#e73d1e_100%)] text-[#fff6f2] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-5px_8px_rgba(0,0,0,0.14)]",
    pressedCap:
      "border-[#982d1a] bg-[linear-gradient(180deg,#f25b32_0%,#d93418_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-4px_7px_rgba(0,0,0,0.14)]",
  },
};

function getWidthPx(width = 1): string {
  const px = width * KEY_UNIT + (width - 1) * KEY_GAP;
  return `${px}px`;
}

export function MechKeyboard({ pressedCodes, profile }: MechKeyboardProps) {
  return (
    <section className="w-full overflow-x-auto px-1 pb-3">
      <div className="mx-auto w-max rounded-[16px] border border-[#6b727a] bg-[linear-gradient(180deg,#2c3137_0%,#1d2127_100%)] px-4 py-4 shadow-[0_12px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-2px_0_rgba(0,0,0,0.55)]">
        {profile.rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="mb-[5px] flex items-center gap-[5px] last:mb-0">
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

              const variant = item.variant ?? "normal";
              const variantStyle = KEY_VARIANT_CLASSES[variant];
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
              const legendSizeClass = item.subLabel
                ? "text-[10px] leading-[1.08]"
                : item.label.length > 4
                  ? "text-[12px]"
                  : "text-[13px]";
              const capPositionClass = isPressed
                ? "left-[2px] right-[2px] top-[3px] bottom-[3px]"
                : "left-[2px] right-[2px] top-[2px] bottom-[5px]";

              return (
                <div key={`${item.code}-${rowIndex}-${itemIndex}`} className="shrink-0" style={keyStyle}>
                  <div
                    className={`relative h-full w-full rounded-[7px] border shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_2px_4px_rgba(0,0,0,0.46)] ${variantStyle.frame}`}
                  >
                    <div
                      className={`absolute overflow-hidden rounded-[5px] border transition-all duration-75 ${capPositionClass} ${variantStyle.cap} ${isPressed ? variantStyle.pressedCap : ""}`}
                    >
                      <div
                        className={`flex h-full w-full select-none px-[7px] py-[6px] font-medium tracking-[0.01em] ${legendLayoutClass} ${legendSizeClass}`}
                      >
                        {item.subLabel ? <span className={`opacity-[0.78] ${legendTextClass}`}>{item.subLabel}</span> : null}
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
