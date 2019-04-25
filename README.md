# run-screen

`run-screen` is tool to run multiple process in parallel in different screen in order to switch from one output to the other.

For example, `run-screen "watch uptime" htop` will start `watch uptime` (refresh uptime every 2 sec) and `htop` in parallel. Pressing the numeric key `2`, of your keyboard, will switch to the `htop` screen. Pressing the numeric key `1`, of your keyboard, will switch to the `watch uptime` screen.

You can have up to 10 process in parallel, switching from one screen to the other by the numeric key of your keyboard, from 1 to 10.

To use it:

```bash
run-screen "command 1" "command 2" "command 3" "... bis 10"
```

To exit, press key combination `ctrl+c`

To stop a process, press key combination `ctrl+space`, start again the process by pressing again `ctrl+space`

## Action keys

- To exit, press key combination `ctrl+c`
- Stop/start process, press key combination `ctrl+space`
- Next screen, press key `>`
- Previous screen, press key `<`
- Dashboard, press key `tab`, and press `tab` again to come back to the previous screen

## Dashboard

![screenshot-dashboard](https://github.com/apiel/run-screen/blob/master/screenshots/screenshot-dashboard.png?raw=true)

The dashboard give you an overview of all the screens. If a new error happen on a screen, it will be shown.

## Advance features

Instead to give the command directly as arguments, it is possible to pass them from a config file.

```bash
run-screen example.config.js
```

example.config.js:

```js
module.exports = {
    screens: [
        {
            cmd: 'yarn foo',
        },
        {
            cmd: 'command 2',
        },
    ],
}
```

This will allow you to access some advance feature, like executing a function before or after the command run:

```js
module.exports = {
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
        ...,
    ],
}
```

`before` and `after` don't get the same parameters. This is because when calling the `before` function the screen and the process are not yet created in contrast to the `after` function.

```tsx
ScreenConfig {
    before?: (id: number, screenConfig: ScreenConfig, runScreen: RunScreen) => Promise<void> | void;
    after?: (screen: Screen, runScreen: RunScreen) => Promise<void> | void;
    cmd: string;
}
```

The config file give you as well the possibility to change the key binding:

```js
module.exports = {
    keys: {
        TOGGLE_PROCESS: 'key', // e.g '\u0000' for ctrl+space
        KILL_PROCESS: 'key', // e.g 'k'
        TOGGLE_DASHBOARD: 'key', // e.g '#'
        NEXT_SCREEN: 'key', // e.g '<'
        PREV_SCREEN: 'key', // ...
    },
    screens: [...],
}
```