const express = require('express');
const multer = require("multer");

const Post = require('../models/post'); ///note uppercase in post

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'imagejpg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cback)=>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");

    if(isValid){
      error = null;
    }
    cback(error, "backend/images");
  },
  filename: (req, file, cback)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];

    cback(null, name + "-"+ Date.now() + "." + ext)
  }

  });

const router = express.Router();


router.post("", multer({storage: storage}).single("image") ,(req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  //save is a mongooose method
  post.save().then(createdPost =>{
    res.status(201).json({
      mesaage: "post added successfully",
      postId : createdPost._id
    });
  });
});


router.get("",(req, res, next) => {

  // static mongoose method to ding the documents in collection posts
  Post.find()
  .then( documents => {

    res.status(200).json({
      message: 'Succesfully sent from api',
      body: documents
    });

  });



});

router.get("/:id", (req, res, next) =>{

  Post.findById(req.params.id).then(post =>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({
        message: "post not found"
      })
    }
  });
})

router.put("/:id", (req, res, next) =>{
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({ message: 'Update successful'})
  })
})

//the colon shows dynamic path
router.delete("/:id", (req, res, next) => {

  Post.deleteOne({ _id: req.params.id}).then(result =>{
    console.log(result);
    res.status(200).json({
      message: 'document deleted'
    });
  });

});

module.exports = router;
