'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Koa = require('koa');
const Router = require('koa-router');
const Cors = require('koa2-cors');
const BodyParser = require('koa-bodyparser');
const errors = require('js-core/errors');
const pkg = require('./package.json');
const querystring = require('querystring');
const utils = require('js-core/utils').create({querystring});
const Static = require('koa-static');
const Mount = require('koa-mount');

// Default to local development env.
process.env.STAGE = process.env.STAGE || 'local';

// Try to read .env manually, for directly run node.
['.', '..'].map(envDir => {
  if (fs.existsSync(path.join(envDir, `.env.${process.env.STAGE}`))) {
    dotenv.config({path: path.join(envDir, `.env.${process.env.STAGE}`)});
  }
});

const app = new Koa();

app.use(async (ctx, next) => {
  // Check required config, user MUST set it in .env or serverless.yml
  const apaasAppId = process.env.APAAS_APPID;
  const apaasSecret = process.env.APAAS_SECRET;
  if (!apaasAppId || !apaasSecret || apaasAppId === 'xxxxxxxxxxxxxxxx' || apaasSecret === 'xxxxxxxxxxxxxxxx') {
    ctx.status = 503;
    ctx.body = errors.create(errors.SystemError, `Invalid config, please check .env file`);
    return;
  }

  await next();
});

app.use(async (ctx, next) => {
  await next();

  if (ctx.body) {
    const {scfRequestId, xRequestId} = errors.koaRequestId(ctx, ctx.body);
    if (scfRequestId && xRequestId && scfRequestId !== xRequestId) {
      console.log(`bind X-Scf-Request-Id ${scfRequestId} to X-Request-ID ${xRequestId}`);
    }
  }
});

// Define the HTTP 404 body.
app.use(async (ctx, next) => {
  await next();

  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = errors.create(errors.SystemError, `${ctx.request.url} not found`);
  }
});

// Use HTTP 500 for application-level error.
app.use(async (ctx, next) => {
  await next();

  if (ctx.body && ctx.body.errorCode) {
    ctx.status = 500;
  }
});

// Append version for normal body.
app.use(async (ctx, next) => {
  await next();

  if (ctx.body && !ctx.body.version) {
    ctx.body.version = pkg.version;
  }
});

app.use(Cors());
app.use(BodyParser());

const router = new Router();
app.use(router.routes());

// For default path.
router.all('/base/v1/', async (ctx) => {
  ctx.body = errors.data(null, 'ok');
});

// For apaasToken generation.
const md5 = require('md5');
router.all('/base/v1/apaas/token', async (ctx) => {
  const q = utils.parseKoaRequest(ctx);
  if (!q.userId) throw errors.create(errors.SystemVerifyError, `invalid userId`);

  const apaasAppId = process.env.APAAS_APPID;
  const apaasSecret = process.env.APAAS_SECRET;
  const userId = q.userId;

  const currentTs = Math.floor(Date.now() / 1000);
  const nonce = Math.random().toString(16).slice(-8);
  const signature = md5(`${apaasAppId}-${apaasSecret}-${userId}-${currentTs}-${nonce}`);
  const apaasToken = `token-${currentTs}-${nonce}-${signature}`;
  console.log(`apaas-token-ok userId=${q.userId}, apaasAppId=${apaasAppId}, apaasToken=${apaasToken}, apaasSecret=${'x'.repeat(apaasSecret.length)}, currentTs=${currentTs}, nonce=${nonce}, signature=${signature}`);

  ctx.body = errors.data({
    userId,
    apaasAppId,
    apaasSecret: apaasToken,
  }, `ok`);
});

// For static files.
app.use(
  Mount(
    '/',
    Static(path.join(__dirname, './html')),
  )
);

// Redirect /${stage}/xxx to /xxx
app.use(new Router({prefix: `/${process.env.STAGE}`}).use(router.routes()).routes());
if (process.env.STAGE !== 'prod') app.use(new Router({prefix: `/prod`}).use(router.routes()).routes());

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});

