const { Router } = require("express");
// const controllers = require('../controllers/somethinghere')

const router = Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");

router.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    User.findOne({ email: email }).then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "saved succesfully!" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signin", (req, res) => {
  try {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt.compare(password, savedUser.password)
      .then(doMatch => {
        if (doMatch) {
        res.json({message: "successfully signed in"})
        }
        else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch(err => {
        console.log(err)
      })
  });
 } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
