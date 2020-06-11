
const express = require('express')
const router = express.Router()
const moment = require('moment')
const getnextday = require('../../config/tools').nextday
const passport = require("passport")

const Profile = require("../../models/Profile")



bookList = 
  [
    {bookname:"三只松鼠",auther:"小明",url:"https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1567242924,3880121425&fm=85&app=92&f=JPEG?w=121&h=75&s=F1DC276600545FCC713BCB6D0300806F"},
    {bookname:"三只松鼠",auther:"小明",url:"https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1567242924,3880121425&fm=85&app=92&f=JPEG?w=121&h=75&s=F1DC276600545FCC713BCB6D0300806F"},
    {bookname:"三只松鼠",auther:"小明",url:"https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1567242924,3880121425&fm=85&app=92&f=JPEG?w=121&h=75&s=F1DC276600545FCC713BCB6D0300806F"},
    {bookname:"三只松鼠",auther:"小明",url:"https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1567242924,3880121425&fm=85&app=92&f=JPEG?w=121&h=75&s=F1DC276600545FCC713BCB6D0300806F"}
  ]


swiper = [
  'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/055caf0913601644a69dedd8d7ba3997.jpg?w=2452&h=920',
  'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7e882fcbdcafc352dde03c741836399b.jpg?thumb=1&w=1226&h=460&f=webp&q=90',
  'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/e5b37cdb85b3b93b5938cc508a10c906.jpg?thumb=1&w=1226&h=460&f=webp&q=90',
  'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/655443f7847f7f7f8c85f89fb3e816e3.jpg?thumb=1&w=1226&h=460&f=webp&q=90'
]




data = {
  bookList,
  swiper
}

// $ route GET api/profiles/test
// @desc 返回的请求的json数据
// @access public
router.get("/test", (req,res) => {
  res.json(data)
})

// $ route POST api/profiles/add
// @desc 创建信息接口
// @access Private
// passport.authenticate('jwt', {session:false})
router.post("/add", (req,res) => {
  // console.log(req);
  

  
  const profileFields = {}

  if (req.query.build) profileFields.build = req.query.build
  if (req.query.time) profileFields.time = req.query.time  
  if (req.query.status) profileFields.status = req.query.status
  if (req.query.name) profileFields.name = req.query.name
  if (req.query.no) profileFields.no = req.query.no
  
  

  new Profile(profileFields).save().then(profile => {
    res.json(profile)
  })
})

// $ route GET api/profiles
// @desc 创建信息接口
// @access Private
router.get("/", (req,res) => {
  // console.log(req.query);
  if (req.query.id) {
    id = req.query.id
    condition = {}
  condition.no = id
  } else {
    condition = {}
  }
  
  
  Profile.find(condition).sort({"createTime":-1})
  .then(profile => {
    if (!profile) {
      return res.status(404).json("没有任何内容")
    }

    res.json(profile)
  })
  .catch(err => res.status(404).json(err));
})

// $ route GET api/count
// @desc 获取个数
// @access Private
router.get("/count", passport.authenticate('jwt', { session: false }), (req,res) => {
  // console.log(req.query);
  
  condition = {}
  if (req.query.date) {  
    req.query.date[1] = getnextday(req.query.date[1])
  }

  if (req.query.date && !req.query.build) {
    condition = {"createTime": {}}
    condition.createTime.$gte = req.query.date[0]
    condition.createTime.$lt = req.query.date[1]    
    
    
  } else if (!req.query.date && req.query.build) {
    condition = {}
    condition.build = req.query.build
  } else if (!req.query.date && !req.query.build) {
    condition = {}
  } else if (req.query.date && req.query.build) {
    condition = {"createTime": {},"build": {}}
    condition.createTime.$gte = req.query.date[0]
    condition.createTime.$lt = req.query.date[1]
    condition.build = req.query.build
  }
 
  
  Profile.find(condition).countDocuments()
  .then(profile => {
    if (!profile) {
      return res.status(404).json("没有任何内容")
    }
    
    // console.log(profile);
    
    res.json(profile)
  })
  .catch(err => res.status(404).json(err));
})


// $ route POST api/profiles/edit
// @desc 创建信息接口
// @access Private
router.post("/edit",(req,res) => {
  console.log(req.query);
  
  const profileFields = {}

  if (req.query.status) profileFields.status = req.query.status
  // if (req.query.classroom) profileFields.classroom = req.query.classroom
  // if (req.query.result) profileFields.result = req.query.result
  // if (req.query.note) profileFields.note = req.query.note
  // if (req.query.solver) profileFields.solver = req.query.solver
  // profileFields.solveTime = moment().format('YYYY-MM-DD HH:mm:ss')

  Profile.findOneAndUpdate(
    {_id: req.query.id},
    {$set: profileFields},
    {new: true}
  ).then(profile => res.json(profile))
})

// $ route POST api/profiles/delete
// @desc 删除信息接口
// @access Private
router.delete("/delete", passport.authenticate('jwt', { session: false }), (req,res) => {
  // console.log(req.query.id);
  
  Profile.findOneAndRemove({_id: req.query.id})
    .then(profile => {
      res.json(profile)
  })
  .catch(err => res.status(404).json("删除失败"))
})



// $ route GET api/profiles/file_export
// @desc 表格导出
// @access Private
router.get("/file_export", passport.authenticate('jwt', { session: false }), (req,res) => {
  console.log(req.query);
  
  condition = {}
  if (req.query.date) {  
    req.query.date[1] = getnextday(req.query.date[1])
  }

  if (req.query.date && !req.query.build) {
    condition = {"createTime": {}}
    condition.createTime.$gte = req.query.date[0]
    condition.createTime.$lt = req.query.date[1]    
    
    
  } else if (!req.query.date && req.query.build) {
    condition = {}
    condition.build = req.query.build
  } else if (!req.query.date && !req.query.build) {
    condition = {}
  } else if (req.query.date && req.query.build) {
    condition = {"createTime": {},"build": {}}
    condition.createTime.$gte = req.query.date[0]
    condition.createTime.$lt = req.query.date[1]
    condition.build = req.query.build
  }
 
  
  Profile.find(condition)
  .then(profile => {
    if (!profile) {
      return res.status(404).json("没有任何内容")
    }
    
    // console.log(profile);
    
    res.json(profile)
  })
  .catch(err => res.status(404).json(err));
})



module.exports = router