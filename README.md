# run-screen

`run-screen` is tool to run multiple process in parallel in different screen in order to switch from one output to the other.

For example, `run-screen "watch uptime" htop` will start `watch uptime` (refresh uptime every 2 sec) and `htop` in parallel. Pressing the numeric key `2` of your keyboard, will switch to the `htop` screen. Pressing the numeric key `1` of your keyboard, will switch to the `watch uptime` screen.

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
- Dashboard, press key `tab`

## Dashboard

![screenshot-dashboard](https://github.com/apiel/run-screen/blob/master/screenshots/screenshot-dashboard.png?raw=true)

The dashboard give you an overview of all the screens. If a new error happen on a screen, it will be shown.