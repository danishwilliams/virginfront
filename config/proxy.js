/**
 * Proxies requests to Dane's API by listening on port 3000 and proxying everything to his machine
 *
 * usage:
 * $ node proxy.js
 */

var http = require('http');

http.createServer(onRequest).listen(3000);
 
function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url);

  var options = {
    hostname: 'virgin.api',
    port: 80,
    path: client_req.url,
    method: 'GET'
  };

  var proxy = http.request(options, function (res) {
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}
