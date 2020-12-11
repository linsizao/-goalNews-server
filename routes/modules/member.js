const Router = require('koa-router')
const Member = require('../../models/Member')
const passport = require('koa-passport')

const router = new Router()

/**
 * @router GET api/member/test
 * @desc 测试接口
 */
router.get('/test', async ctx => {
  ctx.status = 200
  ctx.body = { mas: '/api/member/test' }
})

/**
 * @router GET api/member/current
 * @desc 获取当前用户信息接口
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    console.log(ctx.state.user)
    const member = await Member.find({ userId: ctx.state.user._id }).populate(
      'user',
      ['name', 'email']
    )
    console.log(member)

    if(member.length > 0) {
      ctx.status = 200
      ctx.body = member
    } else {
      ctx.status = 400
      ctx.body = { msg: '该由用户没有相关的个人信息！' }
    }
  }
)

/**
 * @router POST api/member/update
 * @desc 新增修改个人信息
 */
router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    console.log(ctx)
    console.log(ctx.state.user)
    console.log(ctx.request.body)
    const { _id } = ctx.state.user
    const { handle, signature, sex, city, experience, education, social } = ctx.request.body
    const currentMember = {
      userId: _id,
      handle,
      signature,
      sex,
      city,
      experience,
      education,
      social
    }

    // 查询数据库
    const member = await Member.find({userId: _id})
    console.log(member)
    if(member.length > 0) {
      // 执行更新
      const memberUpdate = await Member.findByIdAndUpdate(
        { userId:_id },
        { $set: currentMember },
        { new: true }
      )
      ctx.body = memberUpdate
    } else {
      await new Member(currentMember)
        .save()
        .then(res => {
          ctx.status = 200
          ctx.body = res
        })
    }

  }
)

module.exports = router.routes()
