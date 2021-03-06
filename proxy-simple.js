/**
 * Proxies requests to Dane's API by listening on port 3000 and proxying everything to his machine
 *
 * usage:
 * $ node proxy.js
 */

var http = require('http');
var sleep = require('sleep');
var listenport = 3000;

http.createServer(onRequest).listen(listenport);

var options = {
  //hostname: 'virgin.api',
  hostname: 'virgin.digitaldisruption.co.za', // dev
  //hostname: 'cyclingappuat.azurewebsites.net', // staging
  //hostname: 'cyclingapp.azurewebsites.net', // production
  port: 80
};

console.log('Proxying requests on port ' + listenport + ' to ' + options.hostname + ' (port ' + options.port + ')');
 
function onRequest(client_req, client_res) {
  console.log(client_req.method + ' ' + client_req.url);

  options.path = client_req.url;
  options.method = client_req.method;
  client_req.headers.Host = options.hostname;
  options.headers = client_req.headers;
  //var base64 = new Buffer('roger:Therodge321').toString('base64'); // OpenEar
  //var base64 = new Buffer('dane:Therodge321').toString('base64'); // Simfy
  //options.headers.Authorization = 'Basic ' + base64;

  var proxy = http.request(options, function (res) {
    client_res.statusCode = res.statusCode;
    // Spoof a backend error on PUTs
    if (options.method === 'PUT') {
      //client_res.statusCode = 500;
    }
    //client_res.statusCode = 500;
    //client_res.statusCode = 403;
    client_res.statusMessage = res.statusMessage;
    client_res.headers = res.headers;
    //sleep.sleep(100);
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}
