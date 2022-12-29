const { parse } = require('dotenv');
const {
  errorResponseHandle,
  INVELID_JSON,
  SUCCESS,
  successResponseHandle,
} = require('../helpers/responceHendler.js');
const Device = require('../models/device.js');
const User = require('../models/users.js');

const History = require('../models/history');

exports.CreateAndUpdateHistory = async (data) => {
  const deviceData=await Device.findOne({serial_number:data.devicesId})
  const userData=await User.aggregate([{ $match: { 'devices': (deviceData._id.toString()) } }]);
  data["user_id"]=userData[0]._id;
  data["device_id"]=deviceData._id;

  if (data.status === true) {
    const history = new History({
      device_id: data.device_id,
      user_id: data.user_id,
      pin_Id: data.pin_Id,
      switch_off_time: null,
    });

    history.save(function (err, result) {
      if (err) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: error.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(data, 'History added successfully'));
      }
    });
  } 
  else {
    let finalData = {};
    const history = await History.findOne({
      device_id: data.device_id,
      user_id: data.user_id,
      pin_Id: data.pin_Id,
      switch_off_time: null,
    });

    finalData['switch_off_time'] = new Date();

    let difference =
      (new Date(Date.now()).getTime() -
        new Date(history.switch_on_time).getTime()) /
      1000;
    let hoursDifference = (difference / (60 * 60))?.toFixed(3);

    finalData['duration'] = hoursDifference + 'hr';

    let myDevice = await Device.findOne(
      {
        device_id: data.device_id,
      },
      'pins',
    );
    myDevice = Object.values(myDevice.pins).filter(
      x => x.pinId === data.pin_Id,
    );

    let watt = myDevice[0].watt == '' ? 1000 : myDevice[0].watt;
    let totalWattPrHr = watt * hoursDifference;
    let unit = totalWattPrHr / 1000;
    let cost = (unit * 12)?.toFixed(4);

    finalData['cost'] = cost;
    finalData['consumptionWattPerHour'] = totalWattPrHr;

    History.updateOne(
      {
        device_id: data.device_id,
        user_id: data.user_id,
        pin_Id: data.pin_Id,
        switch_off_time: null,
      },
      { $set: finalData },
      function (error, data) {
        if (error) {
          return res
            .status(INVELID_JSON)
            .json(successResponseHandle({ message: error.message }));
        } else {
          return res
            .status(SUCCESS)
            .json(successResponseHandle(data, 'History updated successfully'));
        }
      },
    );
  }
};

exports.getHistory = async (req, res) => {
  let historyData = await History.find({
    user_id: req.body.user_id,
    device_id: req.body.device_id,
  });

  await Promise.all( historyData.map(async element => {
    if (element.switch_off_time === null) {
      let difference =
        (new Date(Date.now()).getTime() -
          new Date(element.switch_on_time).getTime()) /
        1000;
      let hoursDifference = (difference / (60 * 60))?.toFixed(3);
      let myDevice = await Device.findOne(
        {
          device_id: req.body.device_id,
        },
        'pins',
      );

      myDevice = Object.values(myDevice.pins).filter(
        x => x.pinId === parseInt(element.pin_Id),
      );
      let watt = myDevice[0].watt == '' ? 1000 : myDevice[0].watt;
      let totalWattPrHr = watt * hoursDifference;
      let unit = totalWattPrHr / 1000;
      let cost = (unit * 12)?.toFixed(4);
   
      element.duration = hoursDifference + 'hr';
      element.cost = cost;
      element.consumptionWattPerHour = totalWattPrHr;
      return {...element}
    }
  }));

  return res
    .status(SUCCESS)
    .json(successResponseHandle(historyData, "User's All History"));
};
