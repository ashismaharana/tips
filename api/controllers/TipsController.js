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
        console.log("INFO: Category Add Request Body : ", req.body);
        return Tip.category_add(req.body, function(err, category){
          if (err){
            // console.log('create tip err',err);
            res.serverError();
          }
          else{
            res.json(category);
          }
        });
    },

    /**
     * `TipsController.category_edit()`
     */
    category_edit: function (req, res) {
      // console.log('category edit',req);
          if(req.param('id')){
            var id = req.param('id');
            // console.log('category id :',id);
          }

          Tip.category_edit(id, req.body, function(err, category){
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

        Tip.category_delete(id,  function(err, category){
          if (err)
            res.serverError();
          else
            res.json(category);
        });
    },

    /**
       * `TipsController.categories()`
       */
    categories: function (req, res) {
        var conditions = {};
        if(req.param('id')){
          conditions.id = req.param('id');
        }

        return Category.index(conditions, function(err, Category){
          if (err){
            res.serverError();
          }
          else {
            res.json(Category);
          }
        });
    },


      /**
      * `TipsController.add()`
      */
    add: function (req, res) {
        // console.log('INFO: add req',req);
        var opts = req.body;
        opts.created_by = req.session.user.id;
        Tip.add(opts, function(err, Tip){
            if (err){
                // res.serverError();
            res.badRequest()
                // req.flash('error', 'missing title or description or category');
            }
            else{
                res.json(Tip);
            }
        });
    },



     /**
     * `TipsController.edit()`
     */
        edit: function (req, res) {
            if(req.param('id')){
                var id = req.param('id');
            delete(req.body.categoryTitle);
                console.log('--------------4334-34--34--3-4---',req.body.categoryTitle);
            Tip.edit(id, req.body, function(err, category){
                if (err){
                    res.json({errors: err});
                } else {
                    res.json(category);
                }
            });
          }
        },


  /**
   * `TipsController.delete()`
   */
  delete: function (req, res) {
    if(req.param('id')){
        var id = req.param('id');
    }

    Tip.delete(id,  function(err, category){
        if (err){
            res.serverError();
        }
        else{
            res.json(category)
        }
    });
  },


  /**
   * `TipsController.index()`
   */
    index: function(req, res){
        var conditions = {};
        // console.log("Query Params", req.query);
        var tip_ids = req.query.tip_ids;

        if(req.param('categoryId')){
            conditions.category_id = req.param('categoryId');
        }
        if(req.param('userId')){
            conditions.created_by  = req.param('userId');
        }

        if(tip_ids){
          // console.log("REQ-Query", req.query);
          //conditions.ids = req.query.tip_ids;

          if(typeof(tip_ids) == "string"){
            tipIds = tip_ids.split(/\,\s*/);
          }
          Tip.find()
             .where({id: tipIds})
             .exec(function (err, tips) {
                 if(err){
                    res.serverError(err);
                 } else {
                    res.json(tips);
                 }
              });
             
        } else {
            Tip.list(conditions, function(err, tips){
              if(err){
                res.serverError(err);
              } else {
                res.json(tips);
              }
          });
        }
        
          
    },

    userTip: function(req, res){
        var createdUser = {};
        if(req.param('userId')){
            createdUser.created_by = req.param('userId');
        }

        Tip.topUserTips(createdUser, function(err, tips){
            if(err){
                res.serverError(err);
            } else {
              res.json(tips);
            }
        })

    },
  /**
  * `TipsController.thumbsUp()`
  */
    // thumbsUp: function (req, res) {
    //     var tipId = req.param("tipId");
    //     var userId = req.session.user.id;
    //     if(tipId){
    //         console.log('tipId is :',tipId ,'userId is :',userId);
    //         var data = { user_id: userId, tip_id: tipId, thumbs: 'up'};
    //         return Thumb.upVote(data, function(err, thumb){
    //             console.log("INFO: err", err, "INFO: Thumb",thumb);
    //             if(err){
    //               res.serverError(err);
    //             }
    //             else{
    //               Thumb.updateThumbs(tipId);
    //               res.json(thumb);
    //             }
    //         });
    //     }else{
    //       res.badRequest('tipId missing');
    //     }
    // },

  /**
  * `TipsController.thumbsDown()`
  */
    // thumbsDown: function (req, res) {
    //     var tipId = req.param("tipId");
    //     var userId = req.session.user.id;
    //     if(tipId){
    //         var data = { user_id: userId, tip_id: tipId, thumbs: 'down'};
    //         return Thumb.downVote(data, function(err, thumb){
    //             if(err){
    //                 res.serverError(err);
    //             }
    //             else{
    //                 Thumb.updateThumbs(tipId);
    //                 res.json(thumb)
    //             }  
    //         });
    //     }  else {
    //         res.badRequest('tipId missing');
    //     }
    // },
    // thumbsDownDownVote



    thumbsUpVote: function(req, res){
        var tipId = req.param('tipId');
        var userId = req.session.user.id;
        // console.log('req: ', tipId);
        if(tipId){
          // console.log('userId',userId);
          // console.log('tipId',tipId);
            var data = { user_id: userId, tip_id: tipId, thumbs: 'up' };
          // console.log('up request');

            Thumb.vote(data, function(err, tip){
              // console.log('err and tip', err, tip);
              res.json(tip);
            })
        }
    },

    thumbsDownVote: function(req, res){
        var tipId = req.param('tipId');
        var userId = req.session.user.id;
        // console.log('req: ', tipId);
        if(tipId){
          // console.log('userId',userId);
          // console.log('tipId',tipId);
            var data = { user_id: userId, tip_id: tipId, thumbs: 'down' };
            // console.log('up request');
            
            Thumb.vote(data, function(err, tip){
              // console.log('err and tip', err, tip);
              res.json(tip);
            })
        }
    },

    tipView: function(req, res){
        var tipId = req.param('tipId');
        // console.log('tip id is:', tipId);
        if(tipId){
            Tip.view(tipId, function(err, tip){
            // console.log('tip',tip);
            res.json(tip);
        })
      }
    },

    regenerateESIndex: function(req, res){
      Tip.regenerateESIndex(req.body);
      res.json({msg: 'ok'});
    },

    suggest: function(req, res){
      // console.log('tip controllers')
      var term = req.param('term');
      // console.log("WELL the parameters received are", req.param('term'));
      sails.log.debug('in controllers '+ term);
      if(!term || term.trim() == '')
        res.badRequest('Search term missing');
      else{
        Tip.suggest(term, function(err, results){
          if(err)
            res.serverError(err);
          else{
            res.json(results);
          }
        });
      }
    },

    search: function(req, res){
      var query = {};
      query.title = req.param('title');
      if(!query.title || query.title == '')
        res.badRequest('title is missing');
      else{
        Tip.search(query, function(err, results){
          if(err)
            res.serverError(err);
          else
            res.json(results);
        });
      }
    }

};