import { Screen } from './RunScreen';

const color = (n: number, text: string) => `\x1b[${n}m${text}\x1b[0m`;
const green = (text: string) => color(32, text);
const red = (text: string) => color(31, text);
const dim = (text: string) => color(2, text);
const digit = (value: number) => color(45, ` ${value} `);

export function dashboard(screens: Screen[]) {
    console.clear();

    process.stdout.write(dim(`There is ${screens.length} screens:\n\n`));

    screens.forEach(({ config: { cmd }, missedError, missedOutput }, index) => {
        const error = missedError ? red(` [${missedError} new error(s)]`) : '';
        const newData = missedOutput ? green(' new') : '';
        process.stdout.write(`${digit(index + 1)} ${cmd}${error}${newData}\n`);
    });
}
