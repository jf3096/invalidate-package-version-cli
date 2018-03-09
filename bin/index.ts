#!/usr/bin/env node
import * as program from 'commander';
import * as pkg from '../package.json';
import programActions from '../src/bin';

export type ProgramActionType = Promise<void> | void;

export interface IProgramActions {
  validatePackagePath: (packagePath: string) => ProgramActionType;
}

program
  .version(pkg.version);

program
  .command('validate [packagePath]')
  .description('add something')
  .action(programActions.validatePackagePath);

program
  .parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
}
