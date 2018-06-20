'use strict';

module.exports = function(app) {
  var user = require('../controllers/userController');

  // User
  app.route('/user')
    .get(user.list_all_users)
    .post(user.create_a_user);

  app.route('/user/update/:uid/:email/:displayName')
    .post(user.update_user);

  app.route('/login')
    .get(user.login);

  app.route('/login/email')
    .post(user.login_email);

  app.route('/login/google')
    .get(user.login_google);
};
