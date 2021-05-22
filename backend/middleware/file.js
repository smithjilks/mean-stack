
const multer = require("multer");

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
module.exports = multer({storage: storage}).single("image");
