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
  port: 80,
  //path: 'rockstar/' + client_req.url,
  method: 'GET'
};

console.log('Proxying requests to ' + options.hostname + ' on port ' + options.port);
 
function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url);

  options.path = client_req.url;

  var proxy = http.request(options, function (res) {
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}
