const express = require("express");
const User = require("../models/User");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// User Register
exports.register = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex"),
  });
  //   crypto.createHmac("sha256", uuidv4()).update(newUser.password).digest("hex");

  try {
    const user = await newUser.save();
    user._id = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    user.__v = undefined;
    user.password = undefined;
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

// User Signin
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(401)
        .json({ success: false, msg: "Wrong Email or password" });
    }
    const encry_pass = crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(password)
      .digest("hex");
    if (encry_pass !== user.password) {
      console.log(encry_pass);
      console.log(user.password);
      return res
        .status(401)
        .json({ success: false, msg: "Wrong Email or password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY
    );
    const { _id, username, email } = user;
    return res
      .status(200)
      .json({ success: true, token, user: { _id, username, email } });
  });
};
