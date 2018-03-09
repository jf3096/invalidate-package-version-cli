import {IObject} from '../bin';
import * as os from 'os';

export default class InvalidDependencies {

  private invalidQ: IObject<any>;

  public constructor() {
    this.invalidQ = {};
  }

  public push(sectionName: string, name: string, version: string): void {
    const invalidQSection = this.getInvalidQSection(sectionName);
    invalidQSection[name] = version;
  }

  private getInvalidQSection(sectionName: string): IObject<any> {
    if (!this.invalidQ[sectionName]) {
      this.invalidQ[sectionName] = {};
    }
    return this.invalidQ[sectionName];
  }

  public throw(): void {
    // noinspection TsLint
    if (Object.keys(this.invalidQ).length) {
      throw new Error(
        `found invalid package dependency version: ${os.EOL}${JSON.stringify(this.invalidQ, null, 2)}`
      );
    }
  }
}
