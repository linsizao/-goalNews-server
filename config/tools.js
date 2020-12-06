
const bcrypt = require('bcryptjs')

const tools = {
  /**
   * 密码加密
   * @param {*} pw 
   */
  enbcrypt(pw) {
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(pw, salt)
    return hash
  }
}

module.exports = tools