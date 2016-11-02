var express = require('express');
var app = express();
var getXML = require('./getXML');

var blogs = [];

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');

app.get('/movie', function(req, res) {
    res.render("pages/index", {
        title: "电影",
        movies: blogs
    })
})

//定制404页面 
app.use(function(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});
//定制500页面
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});

blogs = getXML();
// blogs = getXML();
setTimeout(function() { blogs = getXML() }, 5000);
setInterval(function() {
    blogs = getXML();
    console.log(blogs)
}, 500000)
