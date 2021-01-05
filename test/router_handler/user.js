
const db = require('../db/index')
const bcrypt = require('bcryptjs')
const Joi = require('@hapi/joi')

//生成token字符串包
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.regUser = (req, res) => {
    // 检测表单数据是否合法
    const userinfo = req.body
    if (!userinfo.username || !userinfo.password) {
        return res.send({
            status: 1,
            message: '用户名或密码不能为空',
        })
    }

    // 检测用户名是否被占用
    const sqlStr = 'select * from ev_users1 where username=?'
    db.query(sqlStr, [userinfo.username], (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 用户名被占用
        if (results.length > 0) {
            return res.cc('用户名已存在，请重新输入')
        }
    })
    // 给密码加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // 插入新数据
    const insertSql = 'insert into ev_users1 set ?'
    db.query(insertSql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('注册失败')
        }
        res.cc('注册成功', 0)
    })
}

// 登录
exports.login = (req, res) => {
    // 根据用户名检测用户数据
    const userinfo = req.body;
    const sql = 'select * from ev_users1 where username=?'
    db.query(sql, [userinfo.username], (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户登录失败')

        // 检测用户密码
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('用户登录失败')
        }

        // 生成jwttoken字符串
        //1.通过 ES6 的高级语法，快速剔除  密码 和  头像 的值
        const user = {
            ...results[0],
            password: '',
            user_pic: '',
        }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.jwtTime }) //有效期
        // 生成token字符串响应给客户端
        res.send({
            status: 0,
            message: '登陆成功',
            token: tokenStr
        })
    })


}