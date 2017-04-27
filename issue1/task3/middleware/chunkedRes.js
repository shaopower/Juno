'use strict';

const through = require('through');

/*
 * koa2 在 middleware 全部处理完后才触发 handleResponse => respond(ctx)
 * koa 默认 respond 首次 pipe Stream => response，导致 middleware 中 Stream write 无效
 * pipe(ctx.res)，保证 chunked 数据提前 resp
 * ctx.respond = false， 取消 koa 默认 respond
 */
function chunked() {
  return async (ctx, next) => {
    // todo 临时测试方案
    if (ctx.request.url.indexOf('chunked') < 0) {
      await next();
    } else {
      ctx.respond = false;
      const tr = (ctx.body = through());
      tr.pipe(ctx.res);
      if (!ctx.res.headersSent) {
        ctx.type = 'text/html';
        ctx.status = 200;
      }

      await next();

      ctx.body.end();
    }
  };
}

module.exports = chunked;
