'use strict';
// simple http server to support file upload.

var PORT = 3000;

var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('Hello World\n');
}).listen(PORT);

console.log(`Server running at 127.0.0.1:${PORT}`);