"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const invalid_dependecies_1 = require("../models/invalid-dependecies");
class ProgramActions {
    constructor() {
        this.validatePackagePath = this.validatePackagePath.bind(this);
    }
    static getWorkingDirectoryPackageJSONPath() {
        return path.resolve(process.cwd(), 'package.json');
    }
    static validatePackageJSON(packageJSON) {
        const { name, version } = packageJSON;
        if (!name || !version) {
            throw new Error('cannot found name or version in target package.json. probably you have not specify ' +
                'the correct package.json path.');
        }
    }
    validatePackagePath(packagePath) {
        packagePath = packagePath || ProgramActions.getWorkingDirectoryPackageJSONPath();
        if (!path.isAbsolute(packagePath)) {
            packagePath = path.resolve(process.cwd(), packagePath);
        }
        if (!packagePath.endsWith('package.json')) {
            packagePath = path.resolve(packagePath, 'package.json');
        }
        const packageJSON = require(packagePath);
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
                if (ProgramActions.hasInvalidVersion(version)) {
                    invalidDependencies.push(dependencyCategory, name, version);
                }
            });
        });
        return invalidDependencies;
    }
    static hasInvalidVersion(version) {
        const invalidVersionPatterns = ProgramActions.getInvalidVersionPatterns();
        return invalidVersionPatterns.some((invalidPattern) => {
            return invalidPattern.test(version);
        });
    }
    static getInvalidVersionPatterns() {
        return [
            /^file:/
        ];
    }
}
const programActions = new ProgramActions();
exports.default = programActions;
//# sourceMappingURL=index.js.map