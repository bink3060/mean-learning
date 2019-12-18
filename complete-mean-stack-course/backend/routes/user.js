const express = require("express");
const bcrypt = require('bcrypt');
const User = require('../models/user');


const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const hashedPwd = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password: hashedPwd
  });
  const result = await user.save();
  if (!result instanceof User) {
    res.status(201).json({
      message: 'User created',
      password: result
    });
  }
  res.status(500).json({
    error: result
})

});

module.exports = router;
