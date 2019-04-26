- cmd+space doesnt work on Mac find alternative > use '.' for the moment
- ctrl+c doesnt kill process properly on mac

- unit test
- integration test?
- split screen? maybe too complicated


- make example to wait for port to open

```js
var waitOn = require('wait-on');

module.exports = {
    screens: [
        {
            before: (id, screenConfig) => {
                return new Promise(resolve => {
                    waitOn({
                        resources: [
                          'http://127.0.0.1/bar'
                        ]}, function (err) {
                        resolve();
                      });
                });
            },
            cmd: 'yarn foo',
        },
        {
            cmd: 'yarn foo error',
        },
    ],
}
```
