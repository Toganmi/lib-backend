// login & register
const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys')
const passport = require("passport")

const User = require("../../models/User")

// $ route GET api/users
// @desc 返回的user列表
// @access private
router.get("/", (req, res) => {
  User.find({
    $or: [
      { "identity": "学生助理" }, { "identity": "老师" }
    ]
  })
    .then(user => {
      if (!user) {
        return res.status(404).json("没有任何内容")
      }

      res.json(user)
    })
    .catch(err => res.status(404).json(err));
})

// $ route GET api/users/edit
// @desc 修改user信息
// @access private
router.post("/edit", (req, res) => {
  const userFields = {}

  if (req.query.identity) userFields.identity = req.query.identity
  if (req.query.name) userFields.name = req.query.name
  if (req.query.build) userFields.build = req.query.build


  User.findOneAndUpdate(
    { _id: req.query.id },
    { $set: userFields },
    { new: true }
  ).then(user => res.json(user))
})

// $ route POST api/users/delete
// @desc 删除信息接口
// @access Private
router.delete("/delete", (req, res) => {
  // console.log(req.query.id);

  User.findOneAndRemove({ _id: req.query.id })
    .then(profile => {
      res.json(profile)
    })
    .catch(err => res.status(404).json("删除失败"))
})

// $ route GET api/users/register
// @desc 返回的请求的json数据
// @access public
router.post("/register", (req, res) => {
  User.findOne({ account: req.query.account })
    .then((user) => {
      if (user) {
        return res.status(400).json('账号已被注册')
      } else {
        const newUser = new User({
          account: req.query.account,
          password: req.query.password,
        })

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err;

            newUser.password = hash;

            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          });
        });

      }
    })
})

// $ route GET api/users/login
// @desc 返回token
// @access public
router.post("/login", (req, res) => {


  const account = req.query.account
  const password = req.query.password
  // 查询数据库
  User.findOne({ account })
    .then(user => {
      if (!user) {
        return res.json({ code: 0 })
      }
      // console.log(user)
      // 密码匹配
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            res.json({
              success: true
            })
          } else {
            return res.status(400).json({ reason: "密码错误" })
          }
        })
    })
})

// $ route GET api/users/changepassword
// @desc 修改user信息
// @access private
router.post("/changepassword", (req, res) => {
  const userFields = {}


  if (req.query.newPassword) userFields.password = req.query.newPassword

  bcrypt.genSalt(10, function (err, salt) {

    bcrypt.hash(userFields.password, salt, function (err, hash) {
      if (err) throw err;

      userFields.password = hash;

      User.findOneAndUpdate(
        { _id: req.query.id },
        { $set: userFields },
        { new: true }
      ).then(user => res.json(user))
    });



  });



})

// $ route GET api/users/current
// @desc return current user
// @access private
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    account: req.user.account,
    password: req.user.password,
    identity: req.user.identity,
    build: req.user.build,
  })
})

module.exports = router