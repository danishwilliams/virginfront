/**
 * Proxies requests to Dane's API by listening on port 3000 and proxying everything to his machine
 *
 * usage:
 * $ node proxy.js
 */

var http = require('http');
var listenport = 3000;

http.createServer(onRequest).listen(listenport);

var options = {
  hostname: 'virgin.api',
  port: 80
};

console.log('Proxying requests to ' + options.hostname + ' on port ' + options.port);
 
function onRequest(client_req, client_res) {
  console.log(client_req.method + ' ' + client_req.url);

  options.path = client_req.url;
  options.method = client_req.method;

  var proxy = http.request(options, function (res) {
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}
