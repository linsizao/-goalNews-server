// routers
const KoaRouter = require('koa-router')
const user = require('./modules/user')
const member = require('./modules/member')

module.exports = () => {
  const router = new KoaRouter({
    prefix: '/api'
  })

  // 用户
  router.use('/user', user)
  router.use('/member', member)

  return router
}
