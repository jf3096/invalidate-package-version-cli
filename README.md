# invalidate-package-version-cli

> 检查 package.json 多个dependencies 引用了错误格式的 version 版本。

由于个人在开发的过程中往往直接指向本地的 package，在部署时候常常忘记对其进行手动检查，导致在发布时
因个人疏忽部署了如 `"@test/git-remote": "file:E:/projects/git-remote"` 的依赖包。所以当前工具
能够通过在 `prepublishOnly` 对当前 package.json 进行一系列检查从而杜绝这种情况再次发生。

## 安装

```shell
  npm i publish-invalid-version-validate-cli -g
```

## 使用

在 package.json scripts 中加入：

```json
{
  scripts: {
    "prepublishOnly": "invalid-version-validate validate [package.json路径(可选)]"
  }
}
```

## 配置规则

请在 `package.json` 中配置字段 `invalidPatterns`, 并使用其配置相关规则

```package.json
  invalidPatterns: [
    'file:',
    ['e:/projects', 'igm'],
    '^file:',
    '\\^file:'
  ]
```

4种用法：<br />

invalidPattern[0] 会被代码转换成 new RegExp(invalidPatterns[0]), 即判断是否包含该字段。<br />
invalidPattern[1] 会被代码转换成 new RegExp(invalidPatterns[1][0],invalidPatterns[1][1]), 第二个字段可用于配置RegExp Flag。<br />
invalidPattern[2] 会被代码转换成 new RegExp(invalidPatterns[2]), 由于该字符串包含特殊字符 `^`，那么被转成 Regex 后表示字符串必须以 `file：` 开头。<br />
invalidPattern[3] 会被代码转换成 new RegExp(invalidPatterns[3]), 可使用 `\\` 对 RegexExp 关键字转义。<br />

## 作者
Ailun She
