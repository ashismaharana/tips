/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `UserController.login()`
   */
  login: function (req, res) {
    return User.login(req.body, function(err, user){    
      if(err)
        res.forbidden()
      else{
        delete user['password'];
        req.session.authenticated = true;
        req.session.user = user;
        res.json(user); 
      }      
    });
  },

  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {
    // console.log(req.body);
    return User.signup(req.body, function(err, user){
      if(err)
        res.forbidden()
      else{
        res.json(user);
      }
    });
  },

  /**
   * `UserController.admin_index()`
   */
  admin_index: function (req, res) {
    return res.send("Hi there!");
  },

 /**
   * `UserController.profile()`
   */
  profile: function (req, res) {
    return res.json({
      // todo: 'profile() is not implemented yet!'      
    });
  },

  isLogedin: function(req, res) {
    sails.log.debug(req.session)
    if(req.session && req.session.authenticated && req.session.user){
      res.json(req.session.user);
    }else{
      res.json('n');
    }
  }
};

