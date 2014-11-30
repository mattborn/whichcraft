
var connect = require('connect'),
	serveStatic = require('serve-static');

var app = connect().use(serveStatic('public'));

require('http').createServer(app).listen(process.env.PORT);
