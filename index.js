var express = require('express');
var app = express();
var getXML = require('./getXML');
var request = require('./request');
var mongoose = require('mongoose');
var Vacation = require('./models/vacation.js');
var Movie = require('./models/movie.js');
var bodyParser = require('body-parser');

var opts = {
    server: {
        socketOptions: { keeeAlive: 1 }
    }
};
var connectString = 'mongodb://yuxizhe:123@ds143767.mlab.com:43767/data'
mongoose.connect(connectString, opts);


var blogs = [];
var cooks = [];


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    // 跨域
app.use('/api', require('cors')());

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

app.get('/vacations', function(req, res) {
    Vacation.find({ available: true }, function(err, vacations) {
        var context = {
            vacations: vacations.map(function(vacation) {
                return {
                    sku: vacation.sku,
                    name: vacation.name,
                    description: vacation.description,
                    price: vacation.getDisplayPrice(),
                    inSeason: vacation.inSeason,
                }
            })
        };
        res.render('pages/vacations', context);
    });
});

app.get('/api', function(req, res) {
    Vacation.find(function(err, attractions) {
        if (err) return res.send(500, 'Error occurred: database error.');
        res.json(attractions.map(function(vacation) {
            return {
                sku: vacation.sku,
                name: vacation.name,
                description: vacation.description,
                price: vacation.getDisplayPrice(),
                inSeason: vacation.inSeason,
            }
        }));
    });
});

app.post('/api/movies', function(req, res) {
    //res.json(req.body);
    var a = new Movie({
        name: req.body.name,
        img: req.body.img,
        magnet: req.body.magnet
    });
    a.save(function(err, a) {
        if (err) return res.send(500, 'Error occurred: database error.');
        res.json({ id: a._id });
    })

})

app.get('/api/movies', function(req, res) {
    Movie.find(function(err, attractions) {
        if (err) return res.send(500, 'Error occurred: database error.');
        res.json(attractions.map(function(vacation) {
            return {
                name: vacation.name,
                img: vacation.img,
                magnet: vacation.magnet,
            }
        }));
    });
});

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

Vacation.find(function(err, vacations) {
    if (vacations.length) return;
    new Vacation({
        name: 'Hood River Day Trip',
        slug: 'hood-river-day-trip',
        category: 'Day Trip',
        sku: 'HR199',
        description: 'Spend a day sailing on the Columbia and ' +
            'enjoying craft beers in Hood River!',
        priceInCents: 9995,
        tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
        inSeason: true,
        maximumGuests: 16,
        available: true,
        packagesSold: 0,
    }).save();
    new Vacation({
        name: 'Oregon Coast Getaway',
        slug: 'oregon-coast-getaway',
        category: 'Weekend Getaway',
        sku: 'OC39',
        description: 'Enjoy the ocean air and quaint coastal towns!',
        priceInCents: 269995,
        tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
        inSeason: false,
        maximumGuests: 8,
        available: true,
        packagesSold: 0,
    }).save();
    new Vacation({
        name: 'Rock Climbing in Bend',
        slug: 'rock-climbing-in-bend',
        category: 'Adventure',
        sku: 'B99',
        description: 'Experience the thrill of climbing in the high desert.',
        priceInCents: 289995,
        tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
        inSeason: true,
        requiresWaiver: true,
        maximumGuests: 4,
        available: false,
        packagesSold: 0,
        notes: 'The tour guide is currently recovering from a skiing accident.',
    }).save();
});
