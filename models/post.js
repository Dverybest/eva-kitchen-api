var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    category: {
        type: String
    },
    imageurl: {
        type: String,
    },
    videourl: {
        type: String,
    },
    date: { type: Date, default: Date.now },
});

var Post = mongoose.model("post", postSchema);

module.exports = Post;