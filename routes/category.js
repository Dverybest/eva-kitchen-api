const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/category');

router.get('/getallcategories', (req, res, next) => {
    Category.find({}, function (err, data) {
        if (err) return next(err);
        res.status(200).json({ data: data, success: true })
    });
});

router.post('/addcategory', (req, res, next) => {
    let {name} = req.body;

    const category = new Category({
        name: name,
    });
    category.save((err, category) => {
        if (err) return next(err)
        res.status(200).json({
            message: 'Category Created Sucessfully',
            category:category,
            success: true
        });
    });

});

module.exports = router;
