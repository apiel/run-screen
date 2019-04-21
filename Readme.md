# run-screen

`run-screen` is tool to run multiple process in parallel in different screen in order to switch from one output to the other.

For example, `run-screen "watch uptime" htop` will start `watch uptime` (refresh uptime every 2 sec) and `htop` in parallel. Pressing the numeric key `1` of your keyboard, will switch to the `htop` screen. Pressing the numeric key `0` of your keyboard, will switch to the `watch uptime` screen.

You can have up to 10 process in parallel, switching from one screen to the other by the numeric key of your keyboard, from 0 to 9.

To use it:

```bash
run-screen "command 0" "command 1" "command 2" "... bis 9"
```

To exit, press key combination `ctrl+C`
To stop a process, press key combination `ctrl+space`, start again the process by pressing again `ctrl+space`