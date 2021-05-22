const express = require("express");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");

const Post = require('../models/post'); ///note uppercase in post

// multer configuration to handle file uploads to server
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
    cback(error, "backend/images"); // destination folder
  },
  filename: (req, file, cback)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];

    cback(null, name + "-" + Date.now() + "." + ext);
  }

  });

const router = express.Router();


router.post("", checkAuth, multer({storage: storage}).single("image") ,(req, res) => {
  const url = req.protocol + "://" + req.get("host"); // server url
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  //save is a mongooose method
  post.save().then(createdPost =>{
    res.status(201).json({
      mesaage: "post added successfully",
      post: {
        ...createdPost, // spread opertaor to copy the contents of the created . Shorter than below
        id: createdPost._id // overwrite the title
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath

      }
    });
  }).catch(error =>{
    res.status(500).json({
      message: "creating a post failed!"
    })
  });
});


router.get("",(req, res, next) => {

  //pagination query
  const pageSize = +req.query.pagesize;  //+ sign converts the text/string to numeric
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage){
    //There is a more efficient way to query large data sets than this. Check this out https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js
    postQuery
    .skip( pageSize * (currentPage - 1))
    .limit(pageSize);
  }


  // static mongoose method to getting the documents in collection posts
  postQuery.then( documents => {
    fetchedPosts = documents;
    return Post.countDocuments();
  })
  .then(count =>{
    res.status(200).json({
      message: 'Succesfully sent from api',
      body: fetchedPosts,
      maxPosts: count
    });
  })
  .catch(error =>{
    res.status(500).json({
      message: "Fetching posts failed!"
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
  })
  .catch(error =>{ // to catch any technical issue
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
})

router.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, res, next) =>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get("host"); // server url
    imagePath = url + "/images/" + req.file.filename;

  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
    if(result.nModified > 0){
      res.status(200).json({ message: 'Update successful'})
    }else{
      res.status(401).json({ message: 'Not Authorized'})
    }

  }).catch(error =>{
    res.status(500).json({
      message : "Couldn't update post!"
    });
  });
})

//the colon shows dynamic path
router.delete("/:id", checkAuth, (req, res, next) => {

  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId}).then(result =>{

    if(result.n > 0){
      res.status(200).json({ message: 'Deletion successful'})
    }else{
      res.status(401).json({ message: 'Not Authorized'})
    }
  })
  .catch(error =>{
    res.status(500).json({
      message: "Deleting posts failed!"
    });
  });

});

module.exports = router;
