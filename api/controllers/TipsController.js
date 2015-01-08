/**
 * TipsController
 *
 * @description :: Server-side logic for managing tips
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `TipsController.category_add()`
   */
  category_add: function (req, res) {
    return Tips.category_add(req.body, function(err, category){
      if (err)
        res.serverError();
      else
        res.json(category);
    });
  },

  /**
   * `TipsController.category_edit()`
   */
  category_edit: function (req, res) {
      if(req.param('id')){
        var id = req.param('id');
      }

      Tips.category_edit(id, req.body, function(err, category){
        if (err){
          res.json({errors: err});
        } else {
          res.json(category);
        }
      });
  },

  /**
   * `TipsController.category_delete()`
   */
  category_delete: function (req, res) {
    if(req.param('id')){
      var id = req.param('id');
    }

    Tips.category_delete(id,  function(err, category){
      if (err)
        res.serverError();
      else
        res.json(category)
    });
  },

  /**
   * `TipsController.categories()`
   */
  categories: function (req, res) {
    var conditions = {};
    if(req.param('id'))
      conditions.id = req.param('id');

    return Category.index(conditions, function(err, Category){
      if (err)
        res.serverError();
      else
        res.json(Category)
    });
  },

  /**
   * `TipsController.index()`
   */
  index: function(req, res){
    var conditions = {};
    if(req.param('categoryId')){
      conditions.category_id = req.param('categoryId');
    }
    
    if(req.param('userId'))
      conditions.created_by = req.param('userId');

    Tips.list(conditions, function(err, tips){
      if(err)
        res.serverError(err);
      else
        res.json(tips)
    });  
  },

  /**
  * `TipsController.addTips()`
  */
  add: function (req, res) {
    var opts = req.body;
    opts.created_by = req.session.user.id;
    Tips.add(opts, function(err, Tips){
    if (err)
      res.serverError();
    else
      res.json(Tips);
    });
  },

  /**
  * `TipsController.thumbsUp()`
  */
  thumbsUp: function (req, res) {
    var tipId = req.param("tipId");
    var userId = req.session.user.id;
    if(tipId){
      var data = { user_id: userId, tip_id: tipId, thumbs: 'up'};
      return  Thumbs.upVote(data, function(err, thumb){
        if(err)
          res.serverError(err);
        else{
          Thumbs.updateThumbs(tipId);
          res.json(thumb)
        }
      });
    }else
        res.badRequest('tipId missing');
  },

  /**
  * `TipsController.thumbsDown()`
  */
  thumbsDown: function (req, res) {
    var tipId = req.param("tipId");
    var userId = req.session.user.id;
    if(tipId){
      var data = { user_id: userId, tip_id: tipId, thumbs: 'down'};
      return Thumbs.downVote(data, function(err, thumb){
        if(err)
          res.serverError(err);
        else{
          Thumbs.updateThumbs(tipId);
          res.json(thumb)
        }  
      });
    }else
        res.badRequest('tipId missing');
  },

};

