# apaas-token

The backend to generate token for [Timmerse SDK](https://www.npmjs.com/package/timmerse).

## Directions

Activate the following Tencent Cloud services:

- [API Gateway](https://console.cloud.tencent.com/apigateway/service?rid=1), which allows you to access cloud functions and use HTTP APIs
- [COS](https://console.cloud.tencent.com/cos5), which offers storage for your cloud function code
- [CLS](https://console.cloud.tencent.com/cls/overview?region=ap-guangzhou), which helps you manage the logs of your cloud functions
- [SCF](https://console.cloud.tencent.com/scf/list?rid=1&ns=default), which allows your cloud functions to access other Tencent Cloud services

Run the command below to install [Serverless Framework](https://intl.cloud.tencent.com/document/product/583/36263):

```bash
npm install -g serverless
npm install
```

> Note: For directions on how to install Serverless Framework, see [Installation](https://intl.cloud.tencent.com/document/product/583/36263).

> Note: About the installation of Node.js, see [Downloads](https://nodejs.org/zh-cn/download/). On Windows, instead of using PowerShell, you need to launch `Node.js command prompt` as Administrator.

Create an environment variable file `.env`. Replace `xxx` with the actual application ID and key.

```bash
APAAS_APPID=xxxxxxxxxxxxxxxx
APAAS_SECRET=xxxxxxxxxxxxxxxx
```

> Note: To apply for a developer application ID and key, contact us at colleenyu@tencent.com.

Deploy your cloud function. To grant the necessary access, scan the QR code or [configure the key locally](https://intl.cloud.tencent.com/document/product/583/38859#authorizing-with-local-key).

```bash
npm install
sls deploy
```

> Note: On Windows, in order to be able to scan the QR code to grant the necessary access, you need to launch `Node.js command prompt` as Administrator.

Access the API `https://{YOUR_SERVICE}.apigw.tencentcs.com/base/v1/apaas/token?userId=12345678` from a client to get the `apaasToken`.

![apaasToken](https://user-images.githubusercontent.com/91418940/142608944-0890bf01-7ad0-4e78-b281-0c1fed370452.png)

> Note: You can also get the `apaasToken` by opening your gateway address in a browser, as shown above.

## FAQs

Q: How do I view the logs of my cloud function?

> A: You can view the logs of cloud functions [here](https://console.cloud.tencent.com/scf/list-detail?rid=1&ns=default&id=application-prod-apaas-token&menu=log&tab=codeTab).

Q: How do I delete a cloud function?

> A: Run the command `sls remove` to delete a cloud function.

Q: What should I do if API Gateway returns `SystemError(99): Invalid TRTC config`?

> A: Check if you changed the name of the `.env` file (you must not change the filename) and whether the TRTC application ID (TRTC_TIM_APPID) and key (TRTC_TIM_SECRET) were correctly configured.

Q: What should I do if I can’t access API Gateway or SCF?

> A: Make sure you have activated the services and your account does not have overdue payment.

Q: What should I do if I fail to deploy my cloud function on Windows?

> A: Launch `Node.js command prompt` as Administrator. Do not use PowerShell.

Q: How do I know whether I have created a gateway successfully?

> A: If you can access the gateway `https://{YOUR_SERVICE}.apigw.tencentcs.com/helloworld` in a browser, then it’s created successfully.

Q: How do I know whether I have created a function successfully?

> A: If you can access the function `https://{YOUR_SERVICE}.apigw.tencentcs.com/helloworld` in a browser, then it’s created successfully.