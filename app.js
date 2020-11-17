const Koa = require('koa')
const json = require('koa-json')
const KoaRouter = require('koa-router')
const path = require('path')
const render = require('koa-ejs')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new KoaRouter()

app.use(json())
app.use(bodyParser())
// 配置路由模块
app.use(router.routes()).use(router.allowedMethods())

// 配置模板引擎
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  cache: false,
  debug: false
})

// 路由跳转 index
router.get('/', async ctx => {
  await ctx.render('index', {
    title: '这个是一个title'
  })
})

// 添加接口
router.post('/add', add)

async function add(ctx) {
  const body = ctx.request.body
  console.log("req.body = "+JSON.stringify(body))
}


// app.use(async ctx => {
//   ctx.body = {mag:'hello Koa!'}
// })
router.get('/test', ctx => (ctx.body = 'Hello Router!'))

const port = process.env.PoRT || 3000

app.listen(port, () => console.log(`server started at http://localhost:${port}`))
