/*
  proxy-http-to-https.js: Basic example of proxying over HTTP to a target HTTPS server
  Copyright (c) 2013 - 2016 Charlie Robbins, Jarrett Cruger & the Contributors.
  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// @source https://github.com/nodejitsu/node-http-proxy/blob/master/examples/http/proxy-http-to-https.js

var https = require('https'),
    http  = require('http'),
    util  = require('util'),
    path  = require('path'),
    fs    = require('fs'),
    colors = require('colors'),
    httpProxy = require('http-proxy');

var protocol = 'http';
var hostname = 'virgin.digitaldisruption.co.za'; // dev

//var protocol = 'https';
//var hostname = 'cyclingappuat.azurewebsites.net'; // staging

//var protocol = 'https';
//var hostname = 'cyclingapp.azurewebsites.net'; // production

var params = {
  target: protocol + '://' + hostname,
  headers: {
    host: hostname
  }
};

if (protocol === 'https') {
  params.agent = https.globalAgent;  
}


httpProxy.createProxyServer(params).listen(3000);

console.log('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + '3000'.yellow);