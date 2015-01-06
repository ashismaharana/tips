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
    // sails.log.debug(req.method)
    if(req.method == 'POST'){
      // sails.log.debug(req.method)
      return Tips.category_add(req.body, function(err, category){
        if (err)
          res.serverError();
        else
          res.json(category);
      });
    }else{
      // sails.log.debug(req.method)
      return Tips.category_list(function(err, category){
        if (err)
          res.serverError();
        else
          res.json(category);
      });
    }
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
        res.forbidden()
      else
        res.json(Category)
    });
  },
};

