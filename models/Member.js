const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const MemberSchema = new Schema({
  user: {
    // 关联数据表
    type: String,
    ref: 'users',
    required: true
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  signature: {
    type: String,
    default: '这个人很懒什么都没写'
  },
  sex: {
    type: Number,
    required: true,
  },
  city: {
    type: String
  },
  team: [
    {
      teamName: {
        type: String,
        required: true
      },
      teamId: {
        type: String,
        required: true
      },
    }
  ],
  star: [
    {
      starName: {
        type: String,
        required: true
      },
      starId: {
        type: String,
        required: true
      },
    }
  ],
  social: {
    wechat: {
      type: String
    },
    qq: {
      type: String
    },
    phone: {
      type: String
    },
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Member = mongoose.model('Member', MemberSchema);
