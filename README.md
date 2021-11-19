# apaas-token

The backend for [Timmerse](https://www.npmjs.com/package/timmerse)

## Usage

首先，需要开通腾讯云资源：

* [开通API网关](https://console.cloud.tencent.com/apigateway/service?rid=1)，通过API网关访问云函数，提供HTTP API。
* [开通COS存储](https://console.cloud.tencent.com/cos5)，保存云函数代码用的。
* [开通SLS日志服务](https://console.cloud.tencent.com/cls/overview?region=ap-guangzhou)，云函数保存日志用的。
* [云函数授权](https://console.cloud.tencent.com/scf/list?rid=1&ns=default)，云函数访问其他云资源用的。

接着，安装云函数工具[serverless/sls](https://cloud.tencent.com/document/product/583/44753)，安装依赖库：

```bash
npm install -g serverless
npm install
```

> Note: 若安装sls有问题，请看官方说明文档[sls](https://cloud.tencent.com/document/product/583/44753)，有详细解决办法。

> Note: 关于Node安装，请参考[nodejs](https://nodejs.org/zh-cn/download/)，在Windows下请使用Administrator权限启动`Node.js command prompt`，不支持PowerShell。

然后，创建环境变量文件`.env`，注意需要修改下面所有的`xxx`的内容：

```bash
APAAS_APPID=xxxxxxxxxxxxxxxx
APAAS_SECRET=xxxxxxxxxxxxxxxx
```

> Note: 申请开发者业务 ID 和业务 Key（请联系 colleenyu@tencent.com 申请）。

最后，发布云函数，需要扫码授权或配置[本地密钥授权](https://cloud.tencent.com/document/product/583/44786#.E6.9C.AC.E5.9C.B0.E5.AF.86.E9.92.A5.E6.8E.88.E6.9D.83)：

```bash
npm install
sls deploy
```

> Note: Windows用户，请使用Administrator权限启动`Node.js command prompt`，否则扫码认证会失败。

在客户端访问API，获取apaasToken：https://service-xxxyyzzz-1001234567.gz.apigw.tencentcs.com/base/v1/apaas/token?userId=12345678

![apaasToken](https://user-images.githubusercontent.com/91418940/142608944-0890bf01-7ad0-4e78-b281-0c1fed370452.png)

> Note: 在浏览器中直接打开你的网关地址，也应该是成功的才对，如上图所示。

## FAQ

Q: 如何查看云函数的日志？

> A: 查看云函数的日志，请点[这里](https://console.cloud.tencent.com/scf/list-detail?rid=1&ns=default&id=application-prod-apaas-token&menu=log&tab=codeTab)

Q: 如何删除云函数？

> A: 若需要删除云函数，请执行命令：`sls remove`

Q: 为何网关返回的是`SystemError(99): Invalid TRTC config`？

> A: 请确认环境变量`.env`文件，请不要更改文件名，请检查是否正确配置了TRTC的SdkAppId(TRTC_TIM_APPID)和Secret(TRTC_TIM_SECRET)。

Q: 为何网关和函数无法访问？

> A：请确认是否开通服务，请确认是否账户欠费。

Q：为何Windows无法发布云函数？

> A: 请使用系统管理员(Administrator)启动`Node.js command prompt`，请不要用PowerShell。

Q: 如何确认网关创建成功？

> A: 若能在浏览器访问，则网关正常：https://service-xxxyyzzz-1001234567.gz.apigw.tencentcs.com/helloworld

Q: 如何确认函数创建成功？

> A: 若能在浏览器访问，则函数创建正常：https://service-xxxyyzzz-1001234567.gz.apigw.tencentcs.com

