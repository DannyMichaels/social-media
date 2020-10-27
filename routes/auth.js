const { Router } = require("express");
// const controllers = require('../controllers/somethinghere')

const router = Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.get("/", (req, res) => {
  try {
    res.send("hello");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          return res.status(422).json({ error: "user already exists with that email" });
        }
        const user = new User({
          email,
          password,
          name
        })
        user.save()
          .then(user => {
          res.json({message:"saved succesfully!"})
          })
      })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
