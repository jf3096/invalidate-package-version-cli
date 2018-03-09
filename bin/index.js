#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const pkg = require("../package.json");
const bin_1 = require("../src/bin");
program
    .version(pkg.version);
program
    .command('validate [packagePath]')
    .description('add something')
    .action(bin_1.default.validatePackagePath);
program
    .parse(process.argv);
if (process.argv.length === 2) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map