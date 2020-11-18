const Router = require('koa-router')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const router = new Router()

/**
 * @router GET api/users/test
 * @desc 测试接口
 */
router.get('/test', async ctx => {
  ctx.status = 200
  ctx.body = { mas: '/api/users/test' }
})

/**
 * @router POST api/users/register
 * @desc 注册接口
 */
router.post('/register', async ctx => {
  const { name, email, password } = ctx.request.body
  const findResult = await User.find({ email })
  if(findResult.length > 0) {
    ctx.status = 500
    ctx.body = { email: '邮箱已被注册' }
  } else {
    const newUser = new User({ name, email, password })
    await bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if(err) throw err
        newUser.password = hash
      })
    })

    // 入库
    await newUser
      .save()
      .then(res => ctx.body = res)
      .catch(res => console.log(res))
      ctx.body = newUser
  }

})

module.exports = router.routes()
