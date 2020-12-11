const Koa = require('koa')
const json = require('koa-json')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
const { monogURL } = require('./config/keys') // key 配置
const router = require('./routes/index')() // 引入路由
const passport = require('koa-passport')

const app = new Koa()

app.use(json())
app.use(bodyParser())

// 配置路由模块
app.use(router.routes())
  .use(router.allowedMethods())

// 初始化 passPort
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// 连接数据库
mongoose
  .connect(monogURL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('mongodb connectd...')
  })
  .catch(res => {
    console.log(res)
  })

const port = process.env.PoRT || 3000

app.listen(port, () => console.log(`server started at http://localhost:${port}`))
