const express = require('express')
const router  = express.Router()
const userController = require('./user.controller.js')

router.get('/signup',userController.signup)
router.post('/singupinfo',userController.singupinfo)

module.exports = router;