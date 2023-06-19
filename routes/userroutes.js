const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();
let userRoute = express.Router();
require("dotenv").config();
const { userModel } = require("../models/usermodel");


// sign up//

userRoute.post("/user/register", async (req, res) => {
  const { name, email, role, password } = req.body;
  let userData = await userModel.find({ email });
  if (userData.length > 0) {
    res.status(400);
    res.send({msg: "user already exists"});
  } else {
    bcrypt.hash(password, +process.env.saltRounds, async function (err, hash) {
      if (err) {
        console.log(err);
        res.status(400);
        res.send({msg:"something went wrong"});
      } else {
        let userRegisterData = userModel({
          name,
          email,
          role,
          password: hash,
        });
        await userRegisterData.save();
        res.send({msg:"user registered"});
      }
    });
  }
});
//login//

userRoute.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  let userData = await userModel.find({ email });
  console.log(userData);
  if (userData.length > 0) {
    bcrypt.compare(password, userData[0].password, function (err, result) {
      if (result) {
        //   normal token
        var token = jwt.sign(
          { name: userData[0].name, userID: userData[0]._id },
          process.env.secret
        );
        res.send({
          msg: "login successful",
          token: token,
          username: userData[0].name,
          userID: userData[0]._id,
          role: userData[0].role,
          email: userData[0].email,
        });
      } else {
        res.status(400);
        res.send({ msg: "wrong credentials" });
      }
    });
  } else {
    res.status(404);
    res.send({ msg: "wrong credentials" });
  }
});
//logout//

userRoute.post("/user/logout", async (req, res) => {
  const token = req.headers.authorization;
  const blackListData = JSON.parse(
    fs.readFileSync("blacklist.token.json", "utf-8")
  );
  blackListData.push(token);
  fs.writeFileSync("blacklist.token.json", JSON.stringify(blackListData));
  res.send({msg:"logout successful"});
});

//otp generate//
userRoute.post("/otp", async (req, res) => {
  const email = req.body.email;
  try {
    const userData = await userModel.find({ email });
    if (userData.length > 0) {
      let otp = Math.floor(Math.random() * 9000 + 1000);
     res.send({
        message: otp,
      });
    } else {
      res.status(400);
      res.send({
        message: "Incorrect E-Mail",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(402);
    res.send("something went wrong while sending otp");
  }
});
//reset password//

userRoute.patch("/reset", async (req, res) => {
  try {
    const payload = req.body;

    const _id = payload.id;
    const password = payload.password;

    const userData = await userModel.find({ _id });

    if (userData.length > 0) {
      const ID = userData[0]._id;
      bcrypt.hash(password, 3, async function (err, hashed) {
        const reset = { password: hashed };
        await userModel.findByIdAndUpdate({ _id: ID }, reset);
        res.status(200).send({
          ok: true,
          message: "Password Reset Successfully",
        });
      });
    } else {
      res.status(400);
      res.send({ message: "something went wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send("something went wrong please try again");
  }
});



module.exports = { userRoute };