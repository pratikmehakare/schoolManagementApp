const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['Admin', 'Teacher', 'Student'],
    required: true,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role', 
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
