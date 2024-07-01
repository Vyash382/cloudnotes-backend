const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fethuser = require('../middleware/fetchuser');
router.put(
  "/createUser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
      }

      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success ,error: "User already exists with that email" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, "YashSumpremacy");
      success=true;
      res.json({success ,authToken , name: req.body.name});
    } catch (error) {
      res.status(500).send("Some Error occured");
    }
  }
);
router.put(
  "/login",
  [
    body("email", "Email doesnt exists").isEmail(),
    body("password", "Password cant be blank").isLength({ min: 5 }).exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success ,errors: errors.array() });
    }
    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({success ,'error':"Please try to enter with correct credentials"});
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).json({success ,'error':"Please try to enter with correct credentials"});
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, "YashSumpremacy");
      success = true;
      res.json({ success ,authToken, name: user.name });
    } catch (error) {
      res.status(500).send("Some Error occured");
    }
  }
);
//Route 3 
router.get(
  "/login/user",fethuser,
  async (req, res) => {
try {
  userId =req.user.id;
  const user = await User.findById(userId).select("-password");
  res.json({user});
} catch (error) {
  console.log(error);
  res.status(500).send("Some Error occured");
}
});

module.exports = router;
 
