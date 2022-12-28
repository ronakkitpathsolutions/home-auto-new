// import mongoose, { Schema } from 'mongoose';
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    device_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    pin_no: {
      type: String,
    },
    pin_name: {
      type: String,
    },
    switch_on_time: {
      type: Date,
    },
    switch_off_time: {
      type: Date,
    },
    duration: {
      type: String,
    },
    cost:{
      type:Number
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('history', historySchema);
