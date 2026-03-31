export type KeyVariant = "normal" | "modifier" | "accent";

export type KeyboardRowItem =
  | {
      type: "key";
      code: string;
      label: string;
      subLabel?: string;
      width?: number;
      variant?: KeyVariant;
    }
  | {
      type: "spacer";
      width: number;
    };

export type KeyboardProfile = {
  id: string;
  name: string;
  rows: KeyboardRowItem[][];
};

type KeyDef = Omit<Extract<KeyboardRowItem, { type: "key" }>, "type">;

function key(
  code: KeyDef["code"],
  label: KeyDef["label"],
  width?: number,
  subLabel?: string,
  variant?: KeyDef["variant"],
): KeyboardRowItem {
  return { type: "key", code, label, subLabel, width, variant };
}

const KEYCHRON_K2_V2_ROWS: KeyboardRowItem[][] = [
  [
    key("Escape", "esc", undefined, undefined, "accent"),
    key("F1", "F1", undefined, "bri-", "modifier"),
    key("F2", "F2", undefined, "bri+", "modifier"),
    key("F3", "F3", undefined, "task", "modifier"),
    key("F4", "F4", undefined, "spot", "modifier"),
    key("F5", "F5", undefined, "kbd-", "modifier"),
    key("F6", "F6", undefined, "kbd+", "modifier"),
    key("F7", "F7", undefined, "<<", "modifier"),
    key("F8", "F8", undefined, "|>", "modifier"),
    key("F9", "F9", undefined, ">>", "modifier"),
    key("F10", "F10", undefined, "mute", "modifier"),
    key("F11", "F11", undefined, "vol-", "modifier"),
    key("F12", "F12", undefined, "vol+", "modifier"),
    key("PrintScreen", "prt", undefined, undefined, "modifier"),
    key("Delete", "del", undefined, undefined, "modifier"),
    key("BacklightToggle", "lamp", undefined, undefined, "modifier"),
  ],
  [
    key("Backquote", "`", undefined, "~"),
    key("Digit1", "1", undefined, "!"),
    key("Digit2", "2", undefined, "@"),
    key("Digit3", "3", undefined, "#"),
    key("Digit4", "4", undefined, "$"),
    key("Digit5", "5", undefined, "%"),
    key("Digit6", "6", undefined, "^"),
    key("Digit7", "7", undefined, "&"),
    key("Digit8", "8", undefined, "*"),
    key("Digit9", "9", undefined, "("),
    key("Digit0", "0", undefined, ")"),
    key("Minus", "-", undefined, "_"),
    key("Equal", "=", undefined, "+"),
    key("Backspace", "bksp", 2, undefined, "modifier"),
    key("PageUp", "pgup", undefined, undefined, "modifier"),
  ],
  [
    key("Tab", "tab", 1.5, undefined, "modifier"),
    key("KeyQ", "Q"),
    key("KeyW", "W"),
    key("KeyE", "E"),
    key("KeyR", "R"),
    key("KeyT", "T"),
    key("KeyY", "Y"),
    key("KeyU", "U"),
    key("KeyI", "I"),
    key("KeyO", "O"),
    key("KeyP", "P"),
    key("BracketLeft", "[", undefined, "{"),
    key("BracketRight", "]", undefined, "}"),
    key("Backslash", "\\", 1.5, "|"),
    key("PageDown", "pgdn", undefined, undefined, "modifier"),
  ],
  [
    key("CapsLock", "caps", 1.75, undefined, "modifier"),
    key("KeyA", "A"),
    key("KeyS", "S"),
    key("KeyD", "D"),
    key("KeyF", "F"),
    key("KeyG", "G"),
    key("KeyH", "H"),
    key("KeyJ", "J"),
    key("KeyK", "K"),
    key("KeyL", "L"),
    key("Semicolon", ";", undefined, ":"),
    key("Quote", "'", undefined, '"'),
    key("Enter", "enter", 2.25, undefined, "modifier"),
    key("Home", "home", undefined, undefined, "modifier"),
  ],
  [
    key("ShiftLeft", "shift", 2.25, undefined, "modifier"),
    key("KeyZ", "Z"),
    key("KeyX", "X"),
    key("KeyC", "C"),
    key("KeyV", "V"),
    key("KeyB", "B"),
    key("KeyN", "N"),
    key("KeyM", "M"),
    key("Comma", ",", undefined, "<"),
    key("Period", ".", undefined, ">"),
    key("Slash", "/", undefined, "?"),
    key("ShiftRight", "shift", 1.75, undefined, "modifier"),
    key("ArrowUp", "^", undefined, undefined, "modifier"),
    key("End", "end", undefined, undefined, "modifier"),
  ],
  [
    key("ControlLeft", "ctrl", 1.25, undefined, "modifier"),
    key("AltLeft", "opt", 1.25, undefined, "modifier"),
    key("MetaLeft", "cmd", 1.25, undefined, "modifier"),
    key("Space", "", 6.25),
    key("MetaRight", "cmd", 1, undefined, "modifier"),
    key("Fn", "fn", 1, undefined, "modifier"),
    key("ControlRight", "ctrl", 1, undefined, "modifier"),
    key("ArrowLeft", "<", undefined, undefined, "modifier"),
    key("ArrowDown", "v", undefined, undefined, "modifier"),
    key("ArrowRight", ">", undefined, undefined, "modifier"),
  ],
];

export const KEYBOARD_PROFILES: KeyboardProfile[] = [
  {
    id: "keychron-k2-wireless-v2",
    name: "keychron k3(version 2)",
    rows: KEYCHRON_K2_V2_ROWS,
  },
];
