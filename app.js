var http = require('http');
var fs = require('fs');

var server = http.createServer(function(request, response) {

    var src = request.url.substring(1, request.length);
    var extension  = src.substring((src.lastIndexOf('.') + 1));

    console.log('SRC', src);

    if(extension != 'html') {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write('extension html uniquement');
        return response.end();
    }

    fs.readFile(src, "binary", function(error, file) {

        if(error) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write('URL invalide');
            return response.end();
        }

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(file, "binary");
        response.end();
    });
});

server.listen(80);