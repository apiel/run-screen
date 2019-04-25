export const color = (n: number, text: string) => `\x1b[${n}m${text}\x1b[0m`;
export const green = (text: string) => color(32, text);
export const red = (text: string) => color(31, text);
export const dim = (text: string) => color(2, text);
