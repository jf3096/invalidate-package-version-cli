import {IProgramActions} from '../../bin';
import * as path from 'path';
import InvalidDependencies from '../models/invalid-dependecies';

export interface IObject<T> {
  [key: string]: T;
}

class ProgramActions implements IProgramActions {

  public constructor() {
    this.validatePackagePath = this.validatePackagePath.bind(this);
  }

  private static getWorkingDirectoryPackageJSONPath(): string {
    return path.resolve(process.cwd(), 'package.json');
  }

  private static validatePackageJSON(packageJSON: IObject<any>): void {
    const {name, version} = packageJSON;
    if (!name || !version) {
      throw new Error('cannot found name or version in target package.json. probably you have not specify ' +
        'the correct package.json path.');
    }
  }

  public validatePackagePath(packagePath: string): void {
    packagePath = packagePath || ProgramActions.getWorkingDirectoryPackageJSONPath();
    if (!path.isAbsolute(packagePath)) {
      packagePath = path.resolve(process.cwd(), packagePath);
    }
    if (!packagePath.endsWith('package.json')) {
      packagePath = path.resolve(packagePath, 'package.json');
    }
    const packageJSON = require(packagePath);
    ProgramActions.validatePackageJSON(packageJSON);
    const {devDependencies, peerDependencies, dependencies, bundledDependencies} = packageJSON;
    this.validate({devDependencies, peerDependencies, dependencies, bundledDependencies});
  }

  private validate(dependenciesList: IObject<any>): void {
    const invalidDependencies = this.getInvalidDependencies(dependenciesList);
    invalidDependencies.throw();
  }

  private getInvalidDependencies(dependenciesList: IObject<any>): InvalidDependencies {
    const invalidDependencies = new InvalidDependencies();
    Object.keys(dependenciesList).forEach((dependencyCategory: string) => {
      const dependencies = dependenciesList[dependencyCategory] || {};
      Object.keys(dependencies).forEach((name: string) => {
        const version = dependencies[name];
        if (ProgramActions.hasInvalidVersion(version)) {
          invalidDependencies.push(dependencyCategory, name, version);
        }
      });
    });
    return invalidDependencies;
  }

  private static hasInvalidVersion(version: string): boolean {
    const invalidVersionPatterns = ProgramActions.getInvalidVersionPatterns();
    return invalidVersionPatterns.some((invalidPattern) => {
      return invalidPattern.test(version);
    });
  }

  private static getInvalidVersionPatterns(): RegExp[] {
    return [
      /^file:/
    ];
  }
}

const programActions = new ProgramActions();

export default programActions;
