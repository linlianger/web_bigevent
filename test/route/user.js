const express = require('express')
const router = express.Router()

const expressJoi = require('@escook/express-joi')
const {reg_login_schema} = require('../schame/user')

const user_handler = require('../router_handler/user')

//注册路由接口
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)

//登录接口路由
router.post('/login', expressJoi(reg_login_schema), user_handler.login)


module.exports = router