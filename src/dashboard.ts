import { Screen } from './RunScreen';

const color = (n: number, text: string) => `\x1b[${n}m${text}\x1b[0m`;
const red = (text: string) => color(31, text);
const dim = (text: string) => color(2, text);
const digit = (value: number) => color(45, ` ${value} `);

export function dashboard(screens: Screen[]) {
    console.clear();

    process.stdout.write(dim(`There is ${screens.length} screens:\n\n`));

    screens.forEach(({ config: { cmd }, missedError }, index) => {
        const error = missedError ? red(` [${missedError} new error(s)]`) : '';
        process.stdout.write(`${digit(index + 1)} ${cmd}${error}\n`);
    });
}
