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
   * `UserController.isLogedin()`
   */
    isLogedin: function(req, res) {
    sails.log.debug(req.session)
    if(req.session && req.session.authenticated && req.session.user){
      res.json(req.session.user);
    }else{
      res.json('n');
    }
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

  /**
   * `UserController.subscribe()`
   */
  subscribe: function (req, res){

    var categoryId = req.param('categoryId');
    var createdBy = req.param('createdBy');
    var userId = req.session.user.id;

    if(categoryId && createdBy){
      var data = {user_id: userId, created_by: createdBy, category_id: categoryId};
      Subscription.add(data, function(err, subscription){
        if(err)
          res.serverError(err);
        else
          res.json(subscription)
        });
    }else
        res.badRequest('Either of categoryId or createdBy are missing');
    },

  
  /**
   * `UserController.unsubscribe()`
   */
  unsubscribe: function (req, res){
  
    var categoryId = req.param('categoryId');
    var createdBy = req.param('createdBy');
    var userId = req.session.user.id;

    if(categoryId && createdBy){
      var conditions = {user_id: userId, created_by: createdBy, category_id: categoryId};
      Subscription.remove(conditions, function(err, subscription){
        if(err)
          res.serverError(err);
        else
          res.json(subscription)
        });
    }else
        res.badRequest('Either of categoryId or createdBy are missing');
  },
}