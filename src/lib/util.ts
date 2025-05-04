import { GameLevels } from "@tpc/schemas";

type TwoDigitString = `${number}${number}`;

export function padNumber(input: number): TwoDigitString {
  return String(input).padStart(2, "0") as TwoDigitString;
}

export function generateId() {
  return Math.random().toString(36).substring(2, 8);
}

export function getIndexLevels(levels: GameLevels): (number | "-")[] {
  let count = 0;
  return levels.map((l) => (l.type === "game" ? ++count : "-"));
}
