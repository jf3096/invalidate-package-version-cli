# publish-invalid-version-validate-cli

> 检查package.json dependencies引用了错误的version

由于个人在开发的过程中往往直接指向本地的 package，在部署时候常常忘记对其进行手动检查，导致在发布时
因个人疏忽部署了如 `"@xfe/git-remote": "file:E:/projects/git-remote"` 的依赖包。所以当前工具
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

## 作者
Ailun She
