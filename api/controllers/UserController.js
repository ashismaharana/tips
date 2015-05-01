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
            // console.log("null");
            return res.json('Email or password not entered');

            // return res.json(409, {err: 'Email or password not entered'});
        }else{
            User.login(req.body, function(err, user){
            // console.log("RESULT err:",err, "RESULT user:",user);
                if(err) {
                    // res.json('Either email or password is wrong');
                    return res.json(400, {error: 'Either email or password is wrong'});

                } else {
                  console.log(user);
                    delete user['password'];

                    if(user.image != null){
                      console.log(user.image[0] != null);
                    // if(user.images[0] != null){
                      // var img= user.images[0];
                      console.log('enter');
                      var img= user.image;
                      var image = "https://s3-us-west-1.amazonaws.com/tipslydev/avatar/"+img; 
                    }
                    user.avatar = image;
                    console.log('after img'.user);
                    req.session.authenticated = true;
                    req.session.user = user;
                    res.json(user);                 }      
            
            });
        }
    },

  /**
   * `UserController.signup()`
   */
    signup: function (req, res) {

        if(!req.body.firstName || !req.body.email || !req.body.password){
            return res.json('Fill required fields')

        } else{
          // console.log(req.body);
          User.signup(req.body, function(err, user){
              if(err){
                  // res.forbidden();
                  return res.json(409, {error: 'Email address in use'});
              } else{
                  // res.json(user);
                  return res.json(200, {success: 'Account Created'});

              }
          });
        }
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
          // console.log("Before", req.session);
          delete req.session;
          // console.log("After", req.session);
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
      console.log(req.body.avatar);
        delete req.body.avatar;
        delete req.body.image;
        User.updateProfile(req.body ,function(err, updateUser){
          if(!err && updateUser){
            var user = updateUser[0];
            if(user.email != null){
              var img= user.image;
              var image = "https://s3-us-west-1.amazonaws.com/tipslydev/avatar/"+img; 
            }
            user.avatar = image;
            console.log('User after profile update :',user);
            res.json(user);

          } else{
            res.json(404, {error: 'something problem'});

        };
        
    })
   },


    // UserDetails: function(req, res){
    //   console.log(req.param('userDetails'));
    // },

  /**
   * `UserController.subscribe()`
   */
    subscribe: function (req, res){
        var categoryId = req.param('categoryId');
        var createdBy = req.param('createdBy');
        var userId = req.session.user.id;

        if(categoryId && createdBy && userId){
          // var data = {following: userId, followers: createdBy, category_id: categoryId};
          var data = {following: userId, followers: createdBy};
            Subscription.addRemove(data, function(err, subscription){
                sails.log.debug('status',subscription)
                if(err)
                  // res.serverError(err);
                  res.json(409, {error: 'opps something wrong'});
                else
                  // res.json({ok: true});
                  res.json(200,{subscription: subscription});
                });
            }else
                res.json(409, {error: 'Login to subscribe'});
            // res.badRequest('Either of categoryId or createdBy are missing');
    },



  /**
   * `UserController.getSubscribe()`
   */

    getSubscribe: function(req, res){
        if(req.session.user){
            var id = req.session.user.id;
            Subscription.getFollowingList(id, function(err, details){
                // console.log(details);
                if(!err){
                    res.json(details)
                } else{
                    res.json(409, {error: 'Opps something wrong'});
                }
            })
        } else{
            res.json(409, {error: 'Not Login'});

        }
    },
    
  /**
   * `UserController.unsubscribe()`
   */
    // unsubscribe: function (req, res){
    //     var categoryId = req.param('categoryId');
    //     var createdBy = req.param('createdBy');
    //     var userId = req.session.user.id;
    //     if(categoryId && createdBy){
    //         var conditions = {user_id: userId, created_by: createdBy, category_id: categoryId};
    //         Subscription.remove(conditions, function(err, subscription){
    //             if(err)
    //               res.serverError(err);
    //             else
    //               res.json(subscription);
    //             });
    //     }   else {
    //          res.badRequest('Either of categoryId or createdBy are missing');
    //         }
    // },

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

    // uploadPicture: function( req, res){
    //   console.log("Uploading File........");
    //   res.setTimeout(0);

    //   console.log("Request Params >> ", req.params);

    //   req.file('file').upload({
    //     maxBytes: 1000000
    //   }, function whenDone(err, uploadedFiles){
    //     if(err) {
    //       console.log("ERR!!"); 
    //       return res.serverError(err);
    //     } else {
    //       console.log("Success!!!", uploadedFiles);
    //       var fileName = uploadedFiles[0].fd.split("/").pop();
    //       var fileExt = fileName.split(".")[1];
    //       var newFileName = "" + req.session.user.id + "." + fileExt;
          
    //       console.log("File name", fileName, newFileName);
          
    //       var fs = require('fs');

    //       fs.rename(".tmp/uploads/"+ fileName, "public/profile_pictures/" + newFileName + "" , function(err){
    //         if(err){
    //           console.log("Unable to save user's profile photo!!", err);
    //         } else {
    //           console.log("Saved the file!!!");

    //           return res.json({
    //             files: uploadedFiles,
    //             textParams: req.params.all()
    //           });
    //         }
    //       });
    //     }
    //   });

    //     // var data = req.body;

    //     // console.log("REQuest Body", req.body);
    //     // console.log("File requested is >> ", req.file);
    //     // console.log('Update data',data);
    //     // // console.log('all data .........................................',req);
       
    // },

    // uploadPicture2: function(req, res){
    //   console.log('pic');
    //   var userData = {};
    //   userData.image = req.file('file');
    //   userData.user_id = req.session.user.id;
    //   console.log(userData);

    //   User.addImage(userData, function(err, image){
    //       if(!err){
    //           res.json(image);
    //       } else{
    //           res.serverError(err);
    //       }

    //   })
    // },

    download: function (req, res) {
      require('fs').createReadStream(req.param('public/profile_pictures/' + req.session.user.id + '.png'))
        .on('error', function (err) {
          return res.serverError(err);
      })
      .pipe(res);
    },

    notebookEdit: function( req, res){
        var data = req.body;
        // console.log('Update data',data);
        // console.log('all data .........................................',req);
        var id = req.param('notebookId');
        var userId = req.session.user.id;
        var params = req.body;

        params["user_id"] = userId;

        if(userId && id){
            // console.log('notebook id',id );
            Notebook.edit(id, params, function(err, notebook){
              // console.log("After update:: ", notebook, err);
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
                    // req.flash('error', 'oppps');
                } else{
                    res.json(data);
                }
            })
        }
    },

    notebookView: function(req, res){
      // console.log("NB Controller", req.query);
      // console.log("AM i really logged in ?", req.session.user);
        if(req.session.user.id){
          // console.log('hmm i am',req.session.user.id)
            var created_by = req.session.user.id;
            // var tip_id = req.query.tip_id;
            // var tipId = req.query && req.query["tip_id"];

            Notebook.notebook_list(created_by, function(err, notebook){
              // console.log("ErrNoteBook", err, notebook);

                if(err){
                    res.serverError(err);
                } else {
                    // console.log(">> Notebooks are << ", notebook);
                    // if(tip_id){
                    //   console.log("Well >> << lleW", tip_id);
                    // } else {
                    //   console.log("Well, I don't know what tip_id is", tip_id);
                    // }
                    // for(var i=0; i < notebook.length; i++){
                    //   console.log(notebook[i]);
                    // }
                    // if tipId
                    // for(notebook.
                    // console.log('user notebook view api send',notebook);
                    res.json(notebook);
                }
            });
        }  
    },

//follow details for dashboard
    followDetails: function(req, res){
        if(req.session.user){
            var id = req.session.user.id;
            Subscription.followrsAndFollwing(id, function(err, details){
                // console.log(details);
                if(!err){
                    res.json(details)
                } else{
                    res.json(409, {error: 'Opps something wrong'});
                }
            })
        } else{
            res.json(409, {error: 'Not Login'});

        }
    },

    userCountViewer: function(req, res){
        if(req.session.user){
            var id = req.session.user.id;
            Tip.userTipView(id, function(err, view){
                 if(!err){
                    res.json(view);
                    // res.ok()
                } else{
                    res.json(409, {error: 'Opps something wrong'});
                }
            })
        } else{
            res.json(409, {error: 'Not Login'});

        }
    },

    resetPassword: function(req, res){
      // console.log(req.body);

    },

    imageUpload: function(req, res){
      if(req.session.user){
        var opts = req.body;
          opts.user_id = req.session.user.id;
          User.addImage(opts, function(err, userWithImg){
            if(!err){
              var img= userWithImg.image;
              var image = "https://s3-us-west-1.amazonaws.com/tipslydev/avatar/"+img;
              userWithImg.avatar = image;
              // console.log('--------------user------------ctrl----------',userWithImg);
              res.json(userWithImg);

            } else
              res.serverError(err);
          })
      } else{
            res.json(409, {error: 'Not Login'});
      }
    }

};