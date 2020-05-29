var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let SALT = 10;

var categorySchema = new Schema({
    name: {
        type: String
    },
});




var Category = mongoose.model("categories", categorySchema);

module.exports = Category;