const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const Post = require('../models/post');

const upload = multer({ dest: 'uploads/'});

router.get('/getallpost',(req,res,next)=>{
    Post.find({}, function (err, data) {
        if (err) return next(err);
        res.status(200).json({data:data,success:true})
    });
})

router.post('/addpost', upload.single('mediafile'), (req, res, next)=>{

    // let { originalname, mimetype, size,path } = req.file;
    let {title,content,category} = req.body;
   
    // let imageurl="";
    // let videourl ='';
    //req.file.mimetype=="video/mp4"?
     
   // return res.status(200).json({ data: req.file, body: req.body})
    cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret
    })

    const uniqueFilename = new Date().toISOString()
    let data = { public_id: `evakitchen/${uniqueFilename}`, tags: `blog` }
    if (['mp4'].includes(req.file.originalname.split('.')[1])){
        data = {
            ...data, resource_type: "video",
            public_id: "my_folder/my_sub_folder/dog_closeup",
            chunk_size: 6000000,
            eager: [
                { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }], 
        }
    }
    cloudinary.uploader.upload(req.file.path,data,
        (err,mediaurl)=>{
            
            const post = new Post({
                title: title,
                content: content,
                category: category,
                imageurl: ['png', 'jepg', 'jpg'].includes(req.file.originalname.split('.')[1]) ? mediaurl.secure_url : '',
                videourl: ['mp4'].includes(req.file.originalname.split('.')[1]) ? mediaurl.secure_url:''
            });
           
            fs.unlinkSync(req.file.path)
            
            post.save((err, data) => {
                if (err) return next(err)
                res.status(200).json({
                    message: 'Recipe Added Sucessfully',
                    data: data,
                    success: true
                });
            });
        })


   
   

});

module.exports = router;