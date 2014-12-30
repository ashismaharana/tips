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
    return res.json({
      todo: 'login() is not implemented yet!'
    });
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {
    return res.json({
      todo: 'signup() is not implemented yet!'
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
      todo: 'profile() is not implemented yet!'
    });
  }
};

