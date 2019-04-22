console.log(process.cwd());
let count = 0;
setInterval(() => {
    const [, , error] = process.argv;
    if (error) {
        process.stderr.write(`/!\\ ${error}\n`);
    } else {
        process.stdout.write(`Refresh ${count++}\n`);
    }
}, 1000);