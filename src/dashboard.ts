import { Screen } from './RunScreen';
import { color, dim, red, green } from './color';

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
