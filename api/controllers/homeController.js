'use strict';


exports.dashboard = function(req, res) {
  res.render('dashboard/index.ejs', {});
};

exports.welcome = function(req, res){
  res.render('login/welcome/index.ejs', {});
}
