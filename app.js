const Koa = require('koa')
const json = require('koa-json')
const app = new Koa()

app.use(json())

app.use(async ctx => {
  ctx.body = {mag:'hello Koa!'}
})

app.listen(3000, () => console.log('server started at http://localhost:3000'))
