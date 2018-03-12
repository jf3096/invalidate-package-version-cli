"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const invalid_dependecies_1 = require("../models/invalid-dependecies");
const util_1 = require("util");
class ProgramActions {
    constructor(packagePath) {
        this.packageJSON = ProgramActions.getWorkingDirectoryPackageJSON(packagePath);
        this.validatePackagePath = this.validatePackagePath.bind(this);
    }
    static getWorkingDirectoryPackageJSONPath() {
        return path.resolve(process.cwd(), 'package.json');
    }
    static getWorkingDirectoryPackageJSON(packagePath) {
        packagePath = packagePath || ProgramActions.getWorkingDirectoryPackageJSONPath();
        if (!path.isAbsolute(packagePath)) {
            packagePath = path.resolve(process.cwd(), packagePath);
        }
        if (!packagePath.endsWith('package.json')) {
            packagePath = path.resolve(packagePath, 'package.json');
        }
        return require(packagePath);
    }
    static validatePackageJSON(packageJSON) {
        const { name, version } = packageJSON;
        if (!name || !version) {
            throw new Error('cannot found name or version in target package.json. probably you have not specify ' +
                'the correct package.json path.');
        }
    }
    validatePackagePath() {
        const packageJSON = this.packageJSON;
        ProgramActions.validatePackageJSON(packageJSON);
        const { devDependencies, peerDependencies, dependencies, bundledDependencies } = packageJSON;
        this.validate({ devDependencies, peerDependencies, dependencies, bundledDependencies });
    }
    validate(dependenciesList) {
        const invalidDependencies = this.getInvalidDependencies(dependenciesList);
        invalidDependencies.throw();
    }
    getInvalidDependencies(dependenciesList) {
        const invalidDependencies = new invalid_dependecies_1.default();
        Object.keys(dependenciesList).forEach((dependencyCategory) => {
            const dependencies = dependenciesList[dependencyCategory] || {};
            Object.keys(dependencies).forEach((name) => {
                const version = dependencies[name];
                if (this.hasInvalidVersion(version)) {
                    invalidDependencies.push(dependencyCategory, name, version);
                }
            });
        });
        return invalidDependencies;
    }
    hasInvalidVersion(version) {
        const invalidVersionPatterns = ProgramActions.getInvalidVersionPatterns(this.packageJSON);
        return invalidVersionPatterns.some((invalidPattern) => {
            return invalidPattern.test(version);
        });
    }
    static getInvalidVersionPatterns(packageJSON = {}) {
        const PROPERTY_NAME = 'invalidPattern';
        const { invalidPatterns = [] } = packageJSON;
        return invalidPatterns.map((invalidPattern, index) => {
            if (util_1.isArray(invalidPattern)) {
                const regexString = invalidPattern[0];
                const regexFlags = invalidPattern[1];
                if (!util_1.isString(regexString)) {
                    throw new Error(`please ensure the first item of each ${PROPERTY_NAME} is string type.
           error at index = ${index}`);
                }
                if (!util_1.isString(regexFlags)) {
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
            if (util_1.isString(invalidPattern)) {
                invalidPattern = new RegExp(invalidPattern);
                return invalidPattern;
            }
            if (util_1.isRegExp(invalidPattern)) {
                return invalidPattern;
            }
            throw new Error(`please ensure ${PROPERTY_NAME} to be one of the followings: Array, Regex, String`);
        });
    }
}
exports.default = ProgramActions;
//# sourceMappingURL=index.js.map