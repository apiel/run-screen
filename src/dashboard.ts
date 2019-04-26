import { Screen } from './RunScreen';
import { color, dim, red, green } from './color';
import { helpinfo } from './config';

const digit = (value: number) => color(45, ` ${value} `);

export function dashboard(screens: Screen[]) {
    console.clear();

    process.stdout.write(dim(`There is ${screens.length} screens:\n\n`));

    screens.forEach(({ config: { cmd }, proc, missedError, missedOutput }, index) => {
        const error = missedError ? red(` [${missedError} new error(s)]`) : '';
        const stopped = proc ? '' : red(` [stopped]`);
        const newData = missedOutput ? green(' new') : '';
        process.stdout.write(`${digit(index + 1)} ${cmd}${error}${stopped}${newData}\n`);
    });

    process.stdout.write(dim(`${helpinfo}\n`));
}
