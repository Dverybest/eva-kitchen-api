var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
let SALT = 10;

var userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String
    },
    password: {
        type: String,
        minlength: 6,
        require: true
    },
    type: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true,
        unique: 1
    },
    date: { type: Date, default: Date.now },
});


userSchema.pre('save', function (next) {
    let user = this
    if (this.isModified('password')) {
        bcrypt.genSalt(SALT,(err,salt) => {
            if (err)return next(err);
            bcrypt.hash(user.password, salt,(err,hash)=> {
                if (err) return next(err);
                user.password = hash;
                next();
            })

        })
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password,(err,isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    })
}

var User = mongoose.model("users", userSchema);

module.exports = User;