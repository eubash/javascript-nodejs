// This module initializes CLS
// and throws in additional modules to integrate it w/ other libs if needed

const clsNamespace = require("continuation-local-storage").createNamespace("app");

// Must teach bluebird work with CLS
// mz/fs uses bluebird by default if installed
// something else installs bluebird, so it gets used
// if I don't teach bluebird here, it won't keep CLS context, then yield fs.stat will spoil context
require('cls-bluebird')(clsNamespace);

