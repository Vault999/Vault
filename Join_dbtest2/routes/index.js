const express = require('express')
const router = express.Router()

// main은 별기능이없어서 contoller 
const mainController = require('./main')

// 여기 안에서 구분을 해줘야함.
const user = require('./user')

// 메인 페이지
router.get('/',mainController.main)
// URL 생성하겟다 
// localhost:3300
// localhost:3300/signup
// 인자값 2개
// router.get('/signup',signupController.signup)
// MVC
// M : model
// V : view
// C : controller 
// localhost:3000/user/signup
router.use('/user',user)


module.exports = router;