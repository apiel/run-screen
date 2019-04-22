console.log(process.cwd());
setInterval(() => {
    process.stderr.write(`bad error\n`);
}, 1000);