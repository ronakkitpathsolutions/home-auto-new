// import mongoose, { Schema } from 'mongoose';
const mongoose=require('mongoose')

const historySchema = new mongoose.Schema({
  user_id: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
  device_id: {type:mongoose.Schema.Types.ObjectId,ref:"Device"},
  pin_no: {
    type: String,
  },
  pin_name: {
    type: String,
  },
  action_type: {
    type: Boolean,
  },
  action_time: {
    type: Date,
  }},{
    timestamps: true
});

module.exports =mongoose.model('history', historySchema);


