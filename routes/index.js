// routers
const KoaRouter = require('koa-router')
const user = require('./modules/user')

module.exports = () => {
  const router = new KoaRouter({
    prefix: '/api'
  })

  // 用户
  router.use('/user', user)

  return router
}
