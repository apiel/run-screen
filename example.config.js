module.exports = {
    screens: [
        {
            before: (id, screenConfig) => {
                console.log(`\nLet's wait 3 sec to run cmd "${screenConfig.cmd}"\n`);
                return new Promise(resolve => setTimeout(resolve, 3000));
            },
            cmd: 'yarn foo',
            after: (screen) => {
                screen.run.on('close', () => {
                    console.log(`\nRestart process after exit. "${screen.config.cmd}"\n`);
                });
            },
        },
        {
            cmd: 'yarn foo error',
        },
    ],
}
