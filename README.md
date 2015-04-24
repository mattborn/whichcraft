# whichcraft

Simple app for keeping track of which craft beers you’ve had. Like Untappd, but not.

## Alpha branches

Current **master** branch is derived from the evolution of the following orphan branches:

- [alpha-1](https://github.com/mattborn/whichcraft/tree/alpha-1) - first attempt using Backbone + React
- [alpha-2](https://github.com/mattborn/whichcraft/tree/alpha-2) - moved from mattborn/firebase; used @ericcecchi’s singleton
- [alpha-3](https://github.com/mattborn/whichcraft/tree/alpha-3) - tried Grunt + Assemble stack
- [alpha-4](https://github.com/mattborn/whichcraft/tree/alpha-4) - @mattborn’s react-router configuration; immediately deprecated by @ericcecch
- [alpha-5](https://github.com/mattborn/whichcraft/tree/alpha-5) - latest working code from @mattborn + @ericcecchi before removing bloated stack

## Local webserver

Run `npm install && node server.js` to serve the app at [localhost:1996](http://localhost:1996).

Use `jsx --extension jsx --watch . public` (requires [react-tools](https://npmjs.com/package/react-tools))