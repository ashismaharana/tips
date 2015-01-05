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
      return Tips.category_add(req.body, function(err, Category){
        if (err)
          res.serverError();
        else
          res.json(Category);
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
    return Tips.category_edit(req.body, function(err, category){
      if (err)
        res.forbidden()
      else
        res.json(category)
    });
  },


  /**
   * `TipsController.category_delete()`
   */
  category_delete: function (req, res) {
    return Tips.category_delete(req.body, function(err, category){
      if (err)
        res.forbidden()
      else
        res.json(category)
    });
  },


  /**
   * `TipsController.categories()`
   */
  categories: function (req, res) {
    return Category.index(req.body, function(err, category){
      if (err)
        res.forbidden()
      else
        res.json(category)
    });
  },
};

