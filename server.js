var express = require('express');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic('public'));

app.listen(1996) // the year Three Floyds Brewing was founded