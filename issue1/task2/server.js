const url = require('url'),
      querystring = require('querystring');

exports.task2 = function (request, response) {
  const query = querystring.parse(url.parse(request.url).query);
  const defer = query.defer ? 'defer' : '';
  const async = query.async ? 'async' : '';
  const chunk1 = `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>demo</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
          <link rel="stylesheet" href="http://139.196.170.203/juno/static/css/style.css"/>
      </head>
      <body>
          <h1>chunk html</h1>
          <p>dom ready</p>
          <div id="J_DomReady">show</div>
          <p>load finish</p>
          <div id="J_LoadFinish">show</div>
          <p>log</p>
          <div id="J_DomLog"></div>
          <script>
              var timesnipe = performance.now();
              console.log(timesnipe);
              var logDiv = document.querySelector('#J_DomLog');
              document.addEventListener('DOMContentLoaded', function() {
                  document.getElementById('J_DomReady').innerHTML = performance.now() - timesnipe;
              }, false);

              window.addEventListener('load', function() {
                  document.getElementById('J_LoadFinish').innerHTML = performance.now() - timesnipe;
              }, false);

              console.log = function(txt){
                  var df = document.createDocumentFragment();
                  var p = document.createElement('p');
                  p.appendChild(document.createTextNode((performance.now() - timesnipe) + ' ' + txt));
                  df.appendChild(p);
                  logDiv.appendChild(df);
              }
          </script>
          <p>chunk1 end</p>
          `;

  const chunk2 = `<p>chunk2</p>
              <script src="http://139.196.170.203/juno/static/js/5s.js" ${defer} ${async} ></script>
              <script src="http://139.196.170.203:8000/sleep.php" ${defer} ${async}></script>
            </body>
            </html>`;
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-store'
    // 'Content-Encoding': 'none',
    // 'Access-Control-Allow-Origin': '*',
    // 'Set-Cookie': `myCookie=test${Math.random()}`,
  });
  console.log('chunk1', new Date)

  response.write(chunk1);

  setTimeout(() => {
    console.log('chunk2', new Date)
    response.write(chunk2);
    response.end();
  }, query.timeout);
  console.log('timeout', query.timeout);
}
