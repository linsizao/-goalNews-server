const Router = require('koa-router')
const User = require('../../models/User')
const { enbcrypt } = require('../../config/tools') // 密码加密
const bcrypt = require('bcryptjs') // 验证密码
const jwt = require('jsonwebtoken')
const { secretOrKey } = require('../../config/keys')
const passport = require('koa-passport')
const validatorRegisterInput = require('../../validation/register') // 注册验证校验
const validatorLoginInput = require('../../validation/login') // 登录验证校验
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
  const { errors, isValid } = validatorRegisterInput(ctx.request.body)
  if( !isValid ) {
    ctx.status = 400
    ctx.body = errors
    return
  }

  const { name, email, password } = ctx.request.body
  const findResult = await User.find({ email })
  if(findResult.length > 0) {
    ctx.status = 500
    ctx.body = { email: '邮箱已被注册' }
  } else {
    const newUser = new User({
      name,
      email,
      password: enbcrypt(password)
    })

    // 入库
    await newUser
      .save()
      .then(res => ctx.body = res)
      .catch(res => console.log(res))
      ctx.body = newUser
  }
})

/**
 * @router POST api/users/login
 * @desc 登陆接口
 */
router.post('/login', async ctx => {
  const { errors, isValid } = validatorLoginInput(ctx.request.body)
  if( !isValid ) {
    ctx.status = 400
    ctx.body = errors
    return
  }

  const { email, password } = ctx.request.body
  const findResult = await User.find({ email })
  const user = findResult[0]
  if(findResult.length === 0) {
    ctx.status = 404
    ctx.body = { msg: '用户不存在！' }
  } else {
    const result = await bcrypt.compareSync(password, user.password) // 验证密码
    if(result) {
      // 返回 token
      const { name, email, _id } = user
      const payload = { name, email, _id }
      const token = jwt.sign(payload, secretOrKey, { expiresIn: 3600} )
      ctx.status = 200
      ctx.body = {
        msg: '登陆成功！',
        token: `Bearer ${token}`
      }
    } else {
      ctx.status = 400
      ctx.body = { msg: '密码错误！' }
    }
  }
})

/**
 * @router GET api/users/current
 * @desc 验证 token 接口
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    const { _id, name, email } = ctx.state.user
    ctx.body = { id: _id, name, email }
  }
)

module.exports = router.routes()
