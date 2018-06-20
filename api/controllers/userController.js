'use strict';

var moment = require('moment');
const uuidv1 = require('uuid/v1');

var firebase = require('firebase');

//require('firebase/auth');
//var admin = require('firebase-admin');

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB9zKuiyZo-L0STWG86VXB4cVuPMKeWp2Y",
    authDomain: "swi-high-precision-farm.firebaseapp.com",
    databaseURL: "https://swi-high-precision-farm.firebaseio.com",
    projectId: "swi-high-precision-farm",
    storageBucket: "",
    messagingSenderId: "141388591700"
  };
  firebase.initializeApp(config);

var userList = [];

var admin = require("firebase-admin");

var serviceAccount = require("../../keys/swi-high-precision-farm-firebase-adminsdk-ibwdt-cf8c50a22b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://swi-high-precision-farm.firebaseio.com"
});

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.id = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

function snapshotToArray2(snapshot, type) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        if(item.watering_scheme == type)
        {
          item.id = childSnapshot.key;
          returnArr.push(item);
        }
    });

    return returnArr;
};

// Get a reference to the database service
var db = admin.database();

exports.update_user = function(req, res){
  var async = require('async');

  //console.log("Logged in user => "+req.params.displayName);

  async.series([
    function(callback){
      var ref = db.ref('/users/'+req.params.uid);
      console.log("Try reading user ====> " + ref);
      ref.once('value', function(snapshot){
        var userObj = JSON.parse(JSON.stringify(snapshot));
        //console.log("User snapshot => ", userObj);
        callback(null, userObj);
      });
    }
  ], function(err, results){
    if(results[0] == null)
    {
        var ref = db.ref('/users').child(req.params.uid).set({
          email: req.params.email,
          //photoURL: req.params.photoURL,
          displayName: req.params.displayName,
          created_at: moment().format(),
          activated: 'true',
          role: {
            admin: 'false',
            user: 'true',
            farmer: 'false',
            farm_manager: 'false'
          }
        });
    }else {
      var ref = db.ref('/users').child(req.params.uid).update({
        email: req.params.email,
        //photoURL: req.params.photoURL,
        displayName: req.params.displayName,
        last_logged_in: moment().format()
      });
    };
    res.render('dashboard/index.ejs',{});
  });


  /*
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));


  var ref = db.ref('/users').child(req.params.uid).set({
    email: req.params.email,
    //photoURL: req.params.photoURL,
    displayName: req.params.displayName,
    created_at: moment().format()
  }); */
};

exports.login = function(req, res){
  res.render('login/login.ejs', {});
};

exports.login_email = function(req, res){
  var email = req.body.username;
  var password = req.body.password;
  // Initialize Firebase

};

exports.login_google = function(req, res){

};

exports.list_all_users = function(req, res){

  function listAllUsers(nextPageToken) {
   // List batch of users, 1000 at a time.
     admin.auth().listUsers(1000, nextPageToken)
       .then(function(listUsersResult) {
         //console.log("listUsersResult2 length => ", Object.keys(listUsersResult).length);
         /*userList.length = 0;
         listUsersResult.users.forEach(function(userRecord) {
           userList.push({
             uid : userRecord.uid,
             email : userRecord.email,
             displayName : userRecord.displayName,
             photoURL : userRecord.photoURL
           });*/
           //console.log("User list ... " + userList.length);
         //});
           //console.log("user added => ", userList[userList.length - 1]);
           //res.status(200).send("Number of user => ", Object.keys(listUsersResult).length);

         if (listUsersResult.pageToken) {
           // List next batch of users.
           //console.log("user", listUsersResult.users);
           res.render('dashboard/user/list_user.ejs',{users: listUsersResult.users});
           listAllUsers(listUsersResult.pageToken);
           //console.log("listUsersResult3 length => ", Object.keys(listUsersResult).length);
         }
         //resolve(Object.keys(listUsersResult).length);
       })
       .catch(function(error) {
         console.log("Error listing users:", error);
         //reject(Object.keys(listUsersResult).length);
       });
   };

  listAllUsers();
};

exports.create_a_user = function(req, res){

};