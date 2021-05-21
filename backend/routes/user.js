const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user');


router.post("/signup", (req, res, next) =>{

 //npm install --save bcrypt for password hashing
  bcrypt.hash(req.body.password, 10)
  .then( hash =>{
    const user = new User({
      email: req.body.email,
      password: hash
    });

    user.save()
    .then(result =>{
      res.status(210).json({
        message: "user created",
        result: result
      });
    })
    .catch(err =>{
      res.status(500).json({
        error: err
      });
    })
  });




});


router.post("/login", (req, res, next) =>{
  let fetchedUser;

  User.findOne({email: req.body.email})
  .then(user =>{
    if(!user){
      return res.status(401).json({
        messsage: 'Auth response'
      });
    }

    fetchedUser = user;

    bcrypt.compare(req.body.password, user.password)
    .then(result =>{
    console.log(result);
    if(!result){
      return res.status(401).json({
        messsage: 'Auth response'
      });
    }

    //npm install --save jsonwebtoken for creating the token
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      'secret_this_should_be_longer',
      {expiresIn: "1h"});
      res.status(200).json
      ({token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })

  }).catch(err =>{
    return res.status(401).json({
      messsage: 'Auth response'
    });
  });

});
module.exports= router;
