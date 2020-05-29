const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const User = require('../models/user');

router.get('/getalluser',(req,res,next)=>{
    User.find({}, function (err, data) {
        if (err) return next(err);
        res.status(200).json({data:data,success:true})
    });
})

router.post('/signin', (req, res, next) => {
    let {email,password} = req.body;
    User.findOne({email:email}, function (err, user) {
        if (err) return next(err);
        if (user) {
            user.comparePassword(password, (err, isMatch) => {
                if (err) next(err);
                isMatch ? (
                    res.status(200).json({
                        message: 'Logged in successfully',
                        user: user,
                        success: true
                    })
                ) : (
                        res.status(200).json({
                            message: 'Incorrect Password',
                            success: false
                        })
                    )
            })

        } else {
            res.status(200).json({
                success: false,
                message: 'Login failed, user not found'
            });
        }
    });
})

router.post('/signup', (req, res, next) => {
    let {name,password,type,email} = req.body;

    console.log(name, password, type, email)
    if (password.length < 6) {
        let error = new Error("password length cannot be less than 6 characters.")
        error.status = 400;
        next(error);
    }
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        password:password,
        type:type,
        email:email,
    });
    user.save((err,user)=>{
        if(err)return next(err)
        res.status(200).json({
            message: 'User Created Sucessfully',
            user: user,
            success: true
        });
    });

});

module.exports = router;