"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
class InvalidDependencies {
    constructor() {
        this.invalidQ = {};
    }
    push(sectionName, name, version) {
        const invalidQSection = this.getInvalidQSection(sectionName);
        invalidQSection[name] = version;
    }
    getInvalidQSection(sectionName) {
        if (!this.invalidQ[sectionName]) {
            this.invalidQ[sectionName] = {};
        }
        return this.invalidQ[sectionName];
    }
    throw() {
        // noinspection TsLint
        if (Object.keys(this.invalidQ).length) {
            throw new Error(`found invalid package dependency version: ${os.EOL}${JSON.stringify(this.invalidQ, null, 2)}`);
        }
    }
}
exports.default = InvalidDependencies;
//# sourceMappingURL=invalid-dependecies.js.map