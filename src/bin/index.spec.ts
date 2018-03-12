import ProgramActions from './index';
import {expect} from 'chai';

describe('bin/index', () => {
  it('getInvalidVersionPatterns: 能够正确解析字符串', () => {
    const regexList = (ProgramActions as any).getInvalidVersionPatterns({
      invalidPatterns: [
        'file:',
        ['e:/projects', 'igm'],
        '\\^file:'
      ]
    });
    expect(regexList[0].test(`file:E:/projects/git-remote`)).to.be.equal(true);
    expect(regexList[1].test(`file:E:/projects/git-remote`)).to.be.equal(true);
    expect(regexList[2].test(`^file:E:/projects/git-remote`)).to.be.equal(true);
  });

  it('getInvalidVersionPatterns: 保证其没有错误', () => {
    (ProgramActions as any).getInvalidVersionPatterns({
      invalidPatterns: []
    });
    (ProgramActions as any).getInvalidVersionPatterns({});
    (ProgramActions as any).getInvalidVersionPatterns();
  });
});
