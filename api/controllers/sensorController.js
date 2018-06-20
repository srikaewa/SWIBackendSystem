'use strict';

var async = require('async');
var moment = require('moment');
const uuidv1 = require('uuid/v1');
var admin = require("firebase");
var db = admin.database();

var ThingSpeakClient = require('thingspeakclient');


function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.id = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

exports.list_all_sensors = function(req, res){
  var ref = db.ref('/sensor');
  ref.once('value', function(snapshot) {
    var obj = snapshotToArray(snapshot);
    //console.log("Sensor list => " + JSON.stringify(obj) + " with size of " + obj.length);
    res.render('dashboard/sensor/list_sensor.ejs', {sensors: obj});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
};

exports.new_sensor = function(req, res){
  res.render("dashboard/sensor/create_sensor.ejs", {moment: moment});
};

exports.create_a_sensor = function(req, res){
  var sensorClient = new ThingSpeakClient();
  var sensor_id = req.body.add_sensor_id;
  var sensor_description = req.body.add_sensor_description;
  var sensor_read_api_key = req.body.add_sensor_read_api_key;
  //var sensor_sampling_time = req.body.add_sensor_sampling_time;
  console.log('Sensor id = ' + sensor_id + ", key = " + sensor_read_api_key);
  /*var ref = db.ref('/mainpump/' + pump_id).set({
    write_api_key: write_api_key
  });*/
    var ref = db.ref('/sensor').child(sensor_id).set({
      description: sensor_description,
      read_api_key: sensor_read_api_key,
      //sampling_time: sensor_sampling_time,
      activated: 'false',
      entry_id: "-",
      field1: "-",
      field2: "-",
      field3: "-",
      field4: "-",
      field5: "-",
      field6: "-",
      field7: "-",
      field8: "-",
      created_at: "-"
    });
  res.redirect('../sensor')
};

exports.edit_a_sensor = function(req, res){
  var sensor_id = req.params.id;
  var ref = db.ref('/sensor/' + sensor_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    obj.id = sensor_id;
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    var moment = require('moment');
    res.render('dashboard/sensor/edit_sensor.ejs', {sensor: obj, moment: moment});
  });
};

exports.update_a_sensor = function(req, res){
  var sensor_id = req.body.edit_sensor_id;
  var sensor_description = req.body.edit_sensor_description;
  var sensor_read_api_key = req.body.edit_sensor_read_api_key;
  //var sensor_sampling_time = req.body.edit_sensor_sampling_time;
  console.log('sensor id = ' + sensor_id + ", read_api_key = " + sensor_read_api_key);
  var ref = db.ref('/sensor').child(sensor_id).update({
    description: sensor_description,
    read_api_key: sensor_read_api_key,
    //sampling_time: sensor_sampling_time,
    activated: 'false'
  });
  res.redirect('../../sensor');
};

exports.show_sensor = function(req, res){
  var sensorClient = new ThingSpeakClient();
  var sensor_id = req.params.id;
  var ref = db.ref('/sensor/' + sensor_id);
  var async = require('async');

  async.series([
    function(callback){
      sensorClient.getLastEntryInChannelFeed(parseInt(sensor_id), {}, function(err, resp){
        if(typeof resp !== 'undefined')
        {
          db.ref('/sensor').child(sensor_id).update(resp);
          callback(null, 1);
        }
      });
    },
    function(callback){
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = sensor_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    }
  ], function(err, results){
      var moment = require('moment');
      res.render('dashboard/sensor/show_sensor.ejs', {sensor: results[1], moment: moment});
  });
};

exports.api_update_sensor_value = function(req, res){
  var sensorClient = new ThingSpeakClient();
  var sensor_id = req.params.id;
  var ref = db.ref('/sensor/' + sensor_id);
  var async = require('async');

  async.series([
    function(callback){
      sensorClient.getLastEntryInChannelFeed(parseInt(sensor_id), {}, function(err, resp){
        if(typeof resp !== 'undefined')
        {
          db.ref('/sensor').child(sensor_id).update(resp);
          callback(null, 1);
        }
      });
    },
    function(callback){
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = sensor_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    }
  ], function(err, results){
      var moment = require('moment');
      res.send("200");
  });
};

exports.delete_a_sensor = function(req, res){
  var sensor_id = req.body.delete_sensor_id;
  console.log("Delete sensor => " + sensor_id);
  var ref = db.ref('/sensor/'+sensor_id).remove();
  res.redirect('../sensor');
};

exports.delete_a_sensor_id = function(req, res){
  var sensor_id = req.params.id;
  console.log("Delete sensor by id => " + sensor_id);
  var ref = db.ref('/sensor/'+sensor_id).remove(function(err){
    if(err)
      return res.send();
    res.redirect('../../sensor');
  });
};

/*exports.activate_sensor = function(req, res){
  var sensor_id = req.params.id;
  var ref = db.ref('/sensor/'+sensor_id);
  ref.once('value', function(snapshot) {
    var sensorObj = JSON.parse(JSON.stringify(snapshot));
    ref.update({
      activated: 'true'
    });
    console.log("Sensor activated => " + sensorObj.activated);
    var sensorThingspeakIntervalId = setInterval(readSensorValue, sensorObj.sampling_time*60000, sensor_id, sensorThingspeakIntervalId);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  res.redirect('../../sensor');
}; */

exports.activate_sensor = function(req, res){
  var sensor_id = req.params.id;
  //var sensor_timer_id = "sensor_" + req.params.id;
  var ref = db.ref('/sensor/'+sensor_id);
  ref.once('value', function(snapshot) {
    var sensorObj = JSON.parse(JSON.stringify(snapshot));
    ref.update({
      activated: 'true'
    });
    console.log("Sensor activated => " + sensorObj.activated);
    //var sensorThingspeakIntervalId = setInterval(readSensorValue, sensorObj.sampling_time*60000, sensor_id, sensorThingspeakIntervalId);
    //readSensorValue(sensor_id);

    var count = 0;

    //var CronJob = require('cron').CronJob;
    //var job = new CronJob('*/5 * * * *', function() {
    var sensorIntervalObj = setInterval(function(){
      //console.log("Inside tasktimer!!!!!!!!!!!!!!!!!!! => ", sensor_id);
      var sensorClient = new ThingSpeakClient();
      var ref = db.ref('/sensor/'+sensor_id);
      ref.once('value', function(snapshot) {
        var sensorObj = JSON.parse(JSON.stringify(snapshot));
        console.log("[setInterval] Sensor[" +sensor_id+ "] activated => " + sensorObj.activated);
        if(sensorObj.activated == 'false')
          {
            clearInterval(sensorIntervalObj);
            //job.stop();
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
      });
      var d = new Date();
      count++;
      console.log("Reading #" + count + " feed from thingspeak by => " + sensor_id + " @" + d);
      sensorClient.getLastEntryInChannelFeed(parseInt(sensor_id), {}, function(err, resp){
        if(typeof resp !== 'undefined')
        {
          db.ref('/sensor').child(sensor_id).update(resp);
        }
      });
    }, sensorObj.sampling_time*60000);
  //});
  //job.start();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  res.redirect('../../sensor');
};


var readSensorValue = function(sensor_id){
  // Attach an asynchronous callback to read the data at our posts reference
  /*ref.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  }); */
  var sensorClient = new ThingSpeakClient();
  var ref = db.ref('/sensor/'+sensor_id);
  ref.once('value', function(snapshot) {
    var sensorObj = JSON.parse(JSON.stringify(snapshot));
    console.log("[setInterval] Sensor activated => " + sensorObj.activated);
    if(sensorObj.activated == 'false')
      {
        //c(sensor_id)learInterval(int_obj);
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });
  var d = new Date();
  console.log("Reading feed from thingspeak by => " + sensor_id + " @" + d);
  sensorClient.getLastEntryInChannelFeed(parseInt(sensor_id), {}, function(err, resp){
    //var ts_json = JSON.stringify(resp);
    //console.log("Data from sensor[" + sensor_id + "] => " + ts_json);
    if(typeof resp.entry_id !== 'undefined')
    {
      db.ref('/sensor').child(sensor_id).update(resp);
  /*          last_entry_id: resp.entry_id,
        last_entry_field1: resp.field1,
        last_entry_field2: resp.field2,
        last_entry_field3: resp.field3,
        last_entry_field4: resp.field4,
        last_entry_field5: resp.field5,
        last_entry_field6: resp.field6,
        last_entry_field7: resp.field7,
        last_entry_field8: resp.field8,
        last_entry_created_at: resp.created_at*/
      //);
      }
  });
}

exports.deactivate_sensor = function(req, res){
  var sensor_id = req.params.id;
  var ref = db.ref('/sensor/'+sensor_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    ref.update({
      activated: 'false'
    });
    console.log("Sensor activated => " + obj.activated);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });
  res.redirect('../../sensor');
};
