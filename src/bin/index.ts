import {IProgramActions} from '../../bin';
import * as path from 'path';
import InvalidDependencies from '../models/invalid-dependecies';
import {isArray, isRegExp, isString} from 'util';

export interface IObject<T> {
  [key: string]: T;
}

export type IPackageJSON = IObject<any>;

export default class ProgramActions implements IProgramActions {
  private packageJSON: IPackageJSON;

  public constructor(packagePath: string) {
    this.packageJSON = ProgramActions.getWorkingDirectoryPackageJSON(packagePath);
    this.validatePackagePath = this.validatePackagePath.bind(this);
  }

  private static getWorkingDirectoryPackageJSONPath(): string {
    return path.resolve(process.cwd(), 'package.json');
  }

  private static getWorkingDirectoryPackageJSON(packagePath: string): IPackageJSON {
    packagePath = packagePath || ProgramActions.getWorkingDirectoryPackageJSONPath();
    if (!path.isAbsolute(packagePath)) {
      packagePath = path.resolve(process.cwd(), packagePath);
    }
    if (!packagePath.endsWith('package.json')) {
      packagePath = path.resolve(packagePath, 'package.json');
    }
    return require(packagePath);
  }

  private static validatePackageJSON(packageJSON: IObject<any>): void {
    const {name, version} = packageJSON;
    if (!name || !version) {
      throw new Error('cannot found name or version in target package.json. probably you have not specify ' +
        'the correct package.json path.');
    }
  }

  public validatePackagePath(): void {
    const packageJSON = this.packageJSON;
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
        if (this.hasInvalidVersion(version)) {
          invalidDependencies.push(dependencyCategory, name, version);
        }
      });
    });
    return invalidDependencies;
  }

  private hasInvalidVersion(version: string): boolean {
    const invalidVersionPatterns = ProgramActions.getInvalidVersionPatterns(this.packageJSON);
    return invalidVersionPatterns.some((invalidPattern) => {
      return invalidPattern.test(version);
    });
  }

  private static getInvalidVersionPatterns(packageJSON: IPackageJSON = {}): RegExp[] {
    const PROPERTY_NAME = 'invalidPattern';
    const {invalidPatterns = []} = packageJSON;
    return invalidPatterns.map((invalidPattern: string | RegExp, index: number) => {
      if (isArray(invalidPattern)) {
        const regexString = invalidPattern[0];
        const regexFlags = invalidPattern[1];

        if (!isString(regexString)) {
          throw new Error(`please ensure the first item of each ${PROPERTY_NAME} is string type.
           error at index = ${index}`);
        }
        if (!isString(regexFlags)) {
          throw new Error(`please ensure the second item of each ${PROPERTY_NAME} is string type.
           error at index = ${index}`);
        }
        if (/[igm]/.test(regexString)) {
          throw new Error(`the second item of each ${PROPERTY_NAME} refers to RegExp flag.
           it should be either i,g,m or combination of them. error at index = ${index}`);
        }
        invalidPattern = new RegExp(regexString, regexFlags);
        return invalidPattern;
      }
      if (isString(invalidPattern)) {
        invalidPattern = new RegExp(invalidPattern);
        return invalidPattern;
      }
      if (isRegExp(invalidPattern)) {
        return invalidPattern as RegExp;
      }
      throw new Error(`please ensure ${PROPERTY_NAME} to be one of the followings: Array, Regex, String`);
    });
  }
}
