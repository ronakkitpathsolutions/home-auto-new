const {
    errorResponseHandle,
    INVELID_JSON,
    SUCCESS,
    successResponseHandle,
  } =require('../helpers/responceHendler.js') ;

const Device=require('../models/device')

exports.deviceRegister = async(req, res) => {
    const serial_no_exist=await Device.find({serial_number:req.body.serial_number})
    if(serial_no_exist.length>0) {
        return res
    .status(INVELID_JSON)
    .json(successResponseHandle({ message: "Device already exist" }));
    } 
    var device = new Device(req.body);
    await device.save(function (err, result) {
      if (err) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: err.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(result, 'Register successfully'));
      }
    });
  };

exports.getDevices=async(req,res)=>{
    const deviceData=await Device.find()
    return res
          .status(SUCCESS)
          .json(successResponseHandle(deviceData, 'All Devices'))
}

exports.updateDevice = (req,res) => {
  Device.findOneAndUpdate({serial_number:req.body.serial_number}, {$set: req.body}, function (error, data) {
    if (error) {
      return res
        .status(INVELID_JSON)
        .json(successResponseHandle({ message: error.message }));
    } else {
      return res
        .status(SUCCESS)
        .json(successResponseHandle(data, 'Update successfully'));
    }
  });
};

exports.deleteDevice = (req,res) => {
  Device.remove({ serial_number: req.body.serial_number }), function (error, data) {
    if (error) {
      return res
        .status(INVELID_JSON)
        .json(successResponseHandle({ message: error.message }));
    } else {
      return res
        .status(SUCCESS)
        .json(successResponseHandle(data, 'Device removed successfully'));
    }
  }
};

exports.updateDevicePin = (data) => {
  Device.updateOne({serial_number:data.serial_number,"pins.pinId":data.pinId}, {$set: {'pins.$.status': data.status}}, function (error, data) {
    if (error) {
      return res
        .status(INVELID_JSON)
        .json(successResponseHandle({ message: error.message }));
    } else {
      return res
        .status(SUCCESS)
        .json(successResponseHandle(data, 'Pin update successfully'));
    }
  });
};

exports.scheduleTime = (req,res) => {
  Device.updateOne({serial_number:req.body.serial_number,"pins.pinId":req.body.pinId}, {$set: {'pins.$.scheduleStartDateTime': req.body.scheduleStartDateTime,'pins.$.scheduleStopDateTime': req.body.scheduleStopDateTime,}}, function (error, data) {
    if (error) {
      return res
        .status(INVELID_JSON)
        .json(successResponseHandle({ message: error.message }));
    } else {
      return res
        .status(SUCCESS)
        .json(successResponseHandle(data, 'Schedule update successfully'));
    }
  });
};




