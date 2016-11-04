var mongoose = require('mongoose');

var MovieSchema = mongoose.Schema({
    name: String,
    img: String,
    magnet: String,

});
var Movie = mongoose.model('Movie', MovieSchema);
module.exports = Movie;
