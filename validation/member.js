// 登录验证

const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validatorMemberInput (data) {
  let errors = {}
  if(!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = '密码长度为2到40个字符'
  }
  if(validator.isEmpty(data.sex)) {
    errors.sex = '请输入选择性别'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
