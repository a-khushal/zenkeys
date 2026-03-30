export type KeyboardRowItem =
  | {
      type: "key";
      code: string;
      label: string;
      subLabel?: string;
      width?: number;
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
): KeyboardRowItem {
  return { type: "key", code, label, subLabel, width };
}

function spacer(width: number): KeyboardRowItem {
  return { type: "spacer", width };
}

const TKL_ROWS: KeyboardRowItem[][] = [
  [
    key("Escape", "Esc"),
    spacer(0.5),
    key("F1", "F1"),
    key("F2", "F2"),
    key("F3", "F3"),
    key("F4", "F4"),
    spacer(0.5),
    key("F5", "F5"),
    key("F6", "F6"),
    key("F7", "F7"),
    key("F8", "F8"),
    spacer(0.5),
    key("F9", "F9"),
    key("F10", "F10"),
    key("F11", "F11"),
    key("F12", "F12"),
    spacer(0.5),
    key("PrintScreen", "PrtSc"),
    key("ScrollLock", "Scroll"),
    key("Pause", "Pause"),
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
    key("Backspace", "Backspace", 2.2),
    spacer(0.5),
    key("Insert", "Ins"),
    key("Home", "Home"),
    key("PageUp", "PgUp"),
  ],
  [
    key("Tab", "Tab", 1.5),
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
    key("Backslash", "\\", 1.7, "|"),
    spacer(0.5),
    key("Delete", "Del"),
    key("End", "End"),
    key("PageDown", "PgDn"),
  ],
  [
    key("CapsLock", "Caps Lock", 1.75),
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
    key("Enter", "Enter", 2.45),
    spacer(3.5),
  ],
  [
    key("ShiftLeft", "Shift", 2.25),
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
    key("ShiftRight", "Shift", 2.75),
    spacer(1.65),
    key("ArrowUp", "^"),
  ],
  [
    key("ControlLeft", "Ctrl", 1.25),
    key("MetaLeft", "Win", 1.25),
    key("AltLeft", "Alt", 1.25),
    key("Space", "", 6.25),
    key("AltRight", "Alt", 1.25),
    key("Fn", "Fn", 1.25),
    key("ContextMenu", "Menu", 1.25),
    key("ControlRight", "Ctrl", 1.25),
    spacer(0.5),
    key("ArrowLeft", "<"),
    key("ArrowDown", "v"),
    key("ArrowRight", ">"),
  ],
];

const COMPACT_75_ROWS: KeyboardRowItem[][] = [
  [
    key("Escape", "Esc"),
    key("F1", "F1"),
    key("F2", "F2"),
    key("F3", "F3"),
    key("F4", "F4"),
    spacer(0.5),
    key("F5", "F5"),
    key("F6", "F6"),
    key("F7", "F7"),
    key("F8", "F8"),
    spacer(0.5),
    key("F9", "F9"),
    key("F10", "F10"),
    key("F11", "F11"),
    key("F12", "F12"),
    key("Delete", "Del"),
    key("PageUp", "PgUp"),
    key("PageDown", "PgDn"),
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
    key("Backspace", "Backspace", 2),
    key("Home", "Home"),
    key("End", "End"),
  ],
  [
    key("Tab", "Tab", 1.5),
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
    key("Insert", "Ins"),
    key("Delete", "Del"),
  ],
  [
    key("CapsLock", "Caps", 1.75),
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
    key("Enter", "Enter", 2.25),
    key("PageUp", "PgUp"),
    key("PageDown", "PgDn"),
  ],
  [
    key("ShiftLeft", "Shift", 2.25),
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
    key("ShiftRight", "Shift", 2.75),
    key("ArrowUp", "^"),
  ],
  [
    key("ControlLeft", "Ctrl", 1.25),
    key("MetaLeft", "Win", 1.25),
    key("AltLeft", "Alt", 1.25),
    key("Space", "", 6.25),
    key("AltRight", "Alt", 1.25),
    key("MetaRight", "Fn", 1.25),
    key("ControlRight", "Ctrl", 1.25),
    key("ArrowLeft", "<"),
    key("ArrowDown", "v"),
    key("ArrowRight", ">"),
  ],
];

export const KEYBOARD_PROFILES: KeyboardProfile[] = [
  {
    id: "9009-wkl-tkl",
    name: "9009 WKL TKL",
    rows: TKL_ROWS,
  },
  {
    id: "k2-75",
    name: "K2 75%",
    rows: COMPACT_75_ROWS,
  },
  {
    id: "q3-se-tkl",
    name: "Q3 SE TKL",
    rows: TKL_ROWS,
  },
];
