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
  },
  city: {
    type: String
  },
  experience: [
    {
      current: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: String,
        required: true
      },
      to: {
        type: String
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      current: {
        type: Boolean,
        default: true
      },
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String
      },
      from: {
        type: String,
        required: true
      },
      to: {
        type: String
      },
      description: {
        type: String
      }
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
