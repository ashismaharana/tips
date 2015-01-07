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
    sails.log.debug("INFO: Inside TipsController:categories");
    var conditions = {};
    if(req.param('id'))
      conditions.id = req.param('id');

    sails.log.debug("Conditions:", conditions)
    return Category.index(conditions, function(err, Category){
      if (err)
        res.serverError();
      else
        res.json(Category)
    });
  },


  // index: function(req, res){
    
  // },

  /**
  * `TipsController.addTips()`
  */
  add: function (req, res) {
    var opts = req.body;
    opts.created_by = req.session.user.id;
    return Tips.add(opts, function(err, addTips){
    if (err)
      res.serverError();
    else
      res.json(addTips);
    });
  },
};

