const {
  errorResponseHandle,
  INVELID_JSON,
  SUCCESS,
  successResponseHandle,
} = require('../helpers/responceHendler.js');

const Device = require('../models/device');
const User = require('../models/users.js');

exports.deviceRegister = async data => {
  const serial_no_exist = await Device.find({
    serial_number: req.body.serial_number,
  });
  if (serial_no_exist.length > 0) {
    return res
      .status(INVELID_JSON)
      .json(successResponseHandle({ message: 'Device already exist' }));
  }
  const insert_device_data = {
    serial_number: data,
    name: 'my device',
  };
  const device = new Device(req.body);
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

exports.getDevices = async (req, res) => {
  const deviceData = await Device.find({ is_deleted: false });
  return res
    .status(SUCCESS)
    .json(successResponseHandle(deviceData, 'All Devices'));
};

exports.updateDevice = (req, res) => {
  Device.findOneAndUpdate(
    { serial_number: req.body.serial_number },
    { $set: req.body },
    function (error, data) {
      if (error) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: error.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(data, 'Update successfully'));
      }
    },
  );
};

exports.deleteDevice = (req, res) => {
  Device.findOneAndUpdate(
    { _id: req.body.serial_number },
    { $set: { is_deleted: true } },
    function (error, data) {
      if (error) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: error.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(data, 'Delete successfully'));
      }
    },
  );
};

exports.updateDevicePin = data => {
  Device.updateOne(
    { serial_number: data.serial_number, 'pins.pinId': data.pin_Id },
    { $set: { 'pins.$.status': data.status } },
    function (error, data) {
      if (error) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: error.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(data, 'Pin update successfully'));
      }
    },
  );
};

exports.scheduleTime = (req, res) => {
  Device.updateOne(
    { serial_number: req.body.serial_number, 'pins.pinId': req.body.pinId },
    {
      $set: {
        'pins.$.scheduleStartDateTime': req.body.scheduleStartDateTime,
        'pins.$.scheduleStopDateTime': req.body.scheduleStopDateTime,
      },
    },
    function (error, data) {
      if (error) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: error.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(data, 'Schedule update successfully'));
      }
    },
  );
};

exports.getAvailableDevice = async (req, res) => {
  const deviceData = await Device.find({ is_deleted: false });
  let newArray = [];
  if (deviceData.length > 0) {
    await Promise.all(
      deviceData.map(async item => {
        const userData = await User.aggregate([
          { $match: { devices: item._id.toString() } },
        ]);
        if (userData.length == 0) await newArray.push(item);
      }),
    );
  }
  return res
    .status(SUCCESS)
    .json(successResponseHandle(newArray, 'Available devices'));
};