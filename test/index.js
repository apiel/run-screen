console.log(process.cwd());
let count = 0;
setInterval(() => {
    const [, , error] = process.argv;
    if (error) {
        process.stderr.write(`\x1b[31m/!\\\x1b[0m ${error}\n`);
    } else {
        process.stdout.write(`Refresh ${count++}\n`);
    }
}, 3000);