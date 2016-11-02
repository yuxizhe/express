var express = require('express');
var app = express();
var getXML = require('./getXML');
var request = require('./request');

var blogs = [];
var cooks = [];

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render("pages/index", {
        title: "电影",
        movies: blogs
    })
})

app.get('/cook', function(req, res) {
    res.render("pages/cook", {
        title: "菜谱",
        cooks: cooks
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
setTimeout(function() { blogs = getXML(), console.log(blogs) }, 10000);
setInterval(function() {
    blogs = getXML();
    console.log(blogs)
}, 500000);

function food() {
    request('http://apis.baidu.com/tngou/cook/list').then(
        function(result) {
            cooks = result.tngou;
            //console.log(result)
        },
        function(err) {
            console.log(err);
        })
}
food();
setInterval(food, 1000000);
