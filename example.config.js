module.exports = {
    keys: {
        TOGGLE_DASHBOARD: '#',
    },
    screens: [
        {
            before: (id, screenConfig) => {
                console.log(`\nLet's wait 3 sec to run cmd "${screenConfig.cmd}"\n`);
                return new Promise(resolve => setTimeout(resolve, 3000));
            },
            cmd: 'yarn foo',
            after: (screen, runScreenInstance) => {
                screen.proc.on('close', () => {
                    console.log(`\nRestart process after exit. "${screen.config.cmd}"\n`);
                    runScreenInstance.startScreen(screen);
                });
            },
        },
        {
            cmd: 'yarn foo error',
        },
    ],
}
