//导入express
const express = require('express')
//创建服务器实例
const app = express()

//配置cors中间件

const cors = require('cors')
app.use(cors())

//解析urlencoded表单格式
app.use(express.urlencoded({ extended: false }))


//封装res.cc
app.use((req, res, next) => {
    res.cc = function (err, status=1) {
        res.send({
            status,
            message: err instanceof Error? err.message: err,
        })
    }
    next()
})


// 配置解析token的中间件
const config = require('./config')
const jwt = require('express-jwt')
app.use(jwt({secret: config.jwtSecretKey}).unless({path: /^\/api\//}))

//挂载路由
const userRouter = require('./route/user')
app.use('/api', userRouter)

//错误级别中间件
const joi = require('@hapi/joi')
app.use((err, req, res, next) => {
    // token认证失败的错误
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    if(err instanceof joi.ValidationError) return res.cc(err)
    res.cc(err)
})
//启动服务器
app.listen(3008, () => {
    console.log('http:127.0.0.1:3008');
})