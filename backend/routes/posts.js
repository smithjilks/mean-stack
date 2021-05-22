const express = require("express");
const multer = require("multer");

const postController = require("../controllers/post");
const checkAuth = require("../middleware/check-auth");


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


router.post("", checkAuth, multer({storage: storage}).single("image"), postController.createPost);


router.get("", postController.getPosts);

router.get("/:id", postController.getPost);

router.put("/:id", checkAuth, multer({storage: storage}).single("image"), postController.updatePost)

//the colon shows dynamic path
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
