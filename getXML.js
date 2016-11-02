var urlMp4ba = 'http://www.mp4ba.com/rss.php';
var parseString = require('xml2js').parseString;

var http = require("http");
var blogs = new Array();

function download(url, callback) {
    http.get(url, function(res) {
        var data = "";
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on("end", function() {
            callback(data);
        });
    }).on("error", function() {
        callback(null);
    });
};


module.exports = function() {

    download(urlMp4ba, function(data) {
        if (data) {
            //console.log(data)
            return parseString(data, function(err, result) {
                //firebase("rss").remove();
                //console.log(result.rss.channel[0].item[1]);
                if (result) {
                    var blog;
                    blogs = [];
                    for (blog in result.rss.channel[0].item) {
                        var text = result.rss.channel[0].item[blog];

                        blogs.push({
                            title: text.title[0],
                            img: text.description[0].match(/src="http.*jpg/)[0].substr(5),
                            //likes:0
                            magnet: text.magnet[0]["$"]["url"]
                        });
                    };
                    //console.log(blogs);

                }
            });
        } else {
            console.log("error");
            return "error";
        }
    });
    if (blogs)
        return blogs;
}
