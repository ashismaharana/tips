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
        if(!req.body || !req.body.email || !req.body.password){
            console.log("null");
            return res.json('Email or password not entered');
            // return res.json(409, {err: 'Email or password not entered'});
        }else{
            User.login(req.body, function(err, user){
            console.log("RESULT:",err,user);
                if(err) {
                    res.json('Either email or password is wrong');
                } else {
                    delete user['password'];
                    req.session.authenticated = true;
                    req.session.user = user;
                    res.json(user); 
                }      
            });
        }
    },

  /**
   * `UserController.signup()`
   */
    signup: function (req, res) {
        // console.log(req.body);
        return User.signup(req.body, function(err, user){
            if(err){
                res.forbidden();
            } else{
                res.json(user);
            }
        });
    },

  /**
   * `UserController.isLogedin()`
   */
    isLogedin: function(req, res) {
    sails.log.debug(req.session);
        if(req.session && req.session.authenticated && req.session.user){
            res.json(req.session.user);
        } else{
            res.json(false);
        }
    },

  /**
   * `UserController.isLogedin()`
   */
    signOut: function(req, res) {
        sails.log.debug(req.session);
        if(req.session && req.session.authenticated && req.session.user){
          console.log("Before", req.session);
          delete req.session;
          console.log("After", req.session);
          res.json(true);
        }else{
          res.json(false);
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
              res.json(subscription);
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
                  res.json(subscription);
                });
        }   else {
             res.badRequest('Either of categoryId or createdBy are missing');
            }
    },

  /**
   * `UserController.notebook()`
   */

    notebook: function (req, res){
        var opts = req.body;
        opts.created_by = req.session.user.id;

        if(opts.created_by){
            Notebook.add(opts, function(err, notebook){
                if(err){
                  res.serverError();
                } else{
                  res.json(notebook);
                }
            });
        }

    },

    notebookEdit: function( req, res){
        var data = req.body;
        console.log('Update data',data);
        // console.log('all data .........................................',req);
        var id = req.param('notebookId');
        var userId = req.session.user.id;
        var params = req.body;

        params["user_id"] = userId;

        if(userId && id){
            console.log('notebook id',id );
            Notebook.edit(id, params, function(err, notebook){
              console.log("After update:: ", notebook, err);
                if(err){
                  res.serverError();
                } else{
                  res.json(notebook);
                };
            })
        } else {
          res.serverError();
        }
    },

    notebookDelete: function( req, res){
        var id = req.param('notebookId');
        var user = req.session.user.id;

        if(user && id){
            Notebook.notebook_remove(id, function(err, data){
                if(err){
                    res.serverError();
                    req.flash('error', 'oppps');
                } else{
                    res.json(data);
                }
            })
        }
    },

    notebookView: function(req, res){
      // console.log(req.query);
      // console.log("AM i really logged in ?", req.session.user);
        if(req.session.user.id){
          console.log('hmm i am',req.session.user.id)
            var created_by = req.session.user.id;
            var tipId = req.query && req.query["tip_id"];


            Notebook.list(created_by, function(err, notebook){
              console.log("ErrNoteBook", err, notebook);

                if(err){
                    res.serverError(err);
                } else {

                    // if tipId
                    // for(notebook.
                    // console.log('user notebook view api send',notebook);
                    res.json(notebook);
                }
            });
        }  
   },

};