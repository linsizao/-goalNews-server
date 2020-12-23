const Router = require('koa-router')
const Member = require('../../models/Member')
const passport = require('koa-passport')

const validatorMenberInput = require('../../validation/member') // 修改用户信息验证

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
    const member = await Member.find({ user: ctx.state.user._id }).populate(
      'user',
      ['name', 'email']
    )

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
 * @router GET api/member/user?userId=aaaaaa
 * @desc 根据用户 id 查询用户信息
 */
router.get('/user', async ctx => {
  const userId = ctx.query.userId
  const user = await Member.find({user: userId}).populate(
    'user',
    ['name', 'email']
  )

  if (user.length) {
    ctx.status = 200
    ctx.body = user
  } else {
    ctx.status = 404
    ctx.body = { msg: '该由用户没有相关的个人信息！' }
  }
})

/**
 * @router POST api/member/update
 * @desc 新增修改个人信息
 */
router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    const { errors, isValid } = validatorMenberInput(ctx.request.body)
    if( !isValid ) {
      ctx.status = 400
      ctx.body = errors
      return
    }

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
    const member = await Member.find({user: _id})
    if(member.length > 0) {
      // 执行更新
      const memberUpdate = await Member.findOneAndUpdate(
        { user: _id },
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

/**
 * @router POST api/member/addAttentionTeam
 * @desc 设置关注球队接口
 */
router.post('/addAttentionTeam',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    const { _id } = ctx.state.user
    const { teamName, teamId } = ctx.request.body
    const member = await Member.find({ user: _id })
    if (member.length) {
      const teamData = {
        teamName,
        teamId
      }
      const memberUpdate = await Member.findOneAndUpdate(
        { user: _id },
        { $push: { team: [teamData] } },
        { new: true }
      )
      ctx.body = memberUpdate
    } else {
      ctx.status = 404
      ctx.body = { msg: '找不到该用户' }
    }
  })


module.exports = router.routes()
