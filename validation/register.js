// 注册验证

const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validatorRegisterInput (data) {
  let errors = {}
  if(!validator.isLength(data.name, { min: 2, max: 8 })) {
    errors.name = '名字长度为2到8个字符'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
