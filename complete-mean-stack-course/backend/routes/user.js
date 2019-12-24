const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPwd
    });
    const result = await user.save();
    if (result instanceof User) {
      res.status(201).json({
        message: 'User created',
        result: result
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: 'signup error => ' + e
    });
    console.log('signup error => ' + e);
  }


});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
      return res.status(401).json({message: 'auth failed'});
    }

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result)
      return res.status(401).json({message: 'auth failed'});

    const token = jwt.sign(
      {email: user.email, userId: user._id},
      'secretpassword123+',
      {expiresIn: '1h'});
    return res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: user._id
    });
  } catch (e) {
    return res.status(500).json({
      error: 'login error'
    });
    console.log('login error => ' + e);
  }

});

module.exports = router;
