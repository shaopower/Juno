var router = require('koa-router')();
const fetch = require('node-fetch');

router.get('/', async function(ctx, next) {
  ctx.state = {
    title: 'koa2 title'
  };

  await ctx.render('index', {});
});

router.get('/foo', async function(ctx, next) {
  await ctx.render('index', {
    title: 'koa2 foo'
  });
});

const testurl =
  'https://tce.taobao.com/api/mget.htm?callback=&tce_sid=1164438&tce_vid=0&tid=&tab=&topic=&count=&env=online&cna=bJJEEC6ImEoCAbSriLl%2FSJbd';
const testurl2 = 'https://tce.alicdn.com/api/data.htm?ids=222859&callback=';

function parseTest1Ret(ret) {
  ret = ret.result[1164438];
  ret.result = ret.result.map(r => {
    return Object.assign(r, {
      news: r.news.map(m => {
        return m.imgUrl.indexOf('http') >= 0
          ? m
          : Object.assign(m, { imgUrl: `https:${m.imgUrl}` });
      })
    });
  });
  return ret;
}

function parseTest2Ret(ret) {
  return ret[222859];
}

router.get('/chunked', async function(ctx, next) {
  ctx.set('Cache-Control', 'no-store');

  const res = ctx.body;

  await ctx.renderPagelet('header', {
    title: 'chunked demo'
  });
  res.write('<!-- body start -->');

  var p1 = fetch(testurl)
    .then(ret => ret.json())
    .then(ret => parseTest1Ret(ret))
    .then(ret => ctx.renderPagelet('test1', ret));

  var p2 = fetch(testurl2)
    .then(ret => ret.json())
    .then(ret => parseTest2Ret(ret))
    .then(ret => ctx.renderPagelet('test2', ret));

  await Promise.all([p1, p2]);

  await ctx.renderPagelet('footer', {
    script: "console.log('chunked end');"
  });
});

router.get('/test', async function(ctx, next) {
  ctx.set('Cache-Control', 'no-store');

  var p1 = fetch(testurl)
    .then(ret => ret.json())
    .then(ret => parseTest1Ret(ret));

  var p2 = fetch(testurl2)
    .then(ret => ret.json())
    .then(ret => parseTest2Ret(ret));

  await Promise.all([p1, p2]).then(ret => {
    const [r1, r2] = ret;
    return ctx.render('index', {
      title: 'demo',
      result: r1.result,
      value: r2.value,
      script: "console.log('chunked end');"
    });
  });
});

module.exports = router;
