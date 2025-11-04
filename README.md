# \[MWS\] Module to Dispatch Requests between Paths
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue?style=flat-square)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-brightgreen?style=flat-square)](LICENSE.txt)

This repository is designed to be used with the [`MWS-Base`](https://github.com/BjoernBoss/mws-base.git).

It provides a module dispatcher, which uses the request `URL` to dispatch the request to multiple sub-modules.
For this, the requests are afterwards translated, to let modules assume they are at the root.

## Using the Module
To use this module, setup the `mws-base`. Then simply clone this repository into the modules directory:

	$ git clone https://github.com/BjoernBoss/mws-dispatch.git modules/dispatch

Afterwards, transpile the entire server application, and this module up in the `setup.js Run` method as:

```JavaScript
const m = await import("./dispatch/path-dispatch.js");
server.listenHttp(93, new m.PathDispatch({ '/abc': other, '/': default }), null);
```
