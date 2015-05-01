/**
* Subscription.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  attributes: {
    // category_id : { 
    //   required: true
    // },
    followers: { 
      type: 'string', 
      required :true 
    },
    following: { 
      type: 'string',
      required :true 
    },
  },

  // beforeValidate: function(params, next){
  //  if(!params.category_id) 
  //   return next();
  //  Category.findOne(params.category_id).exec(function(err, category){
  //     if(err || !category){ 
  //             return next(Error('Category Not Found')); 
  //     }
  //     else 
  //       return next();
  //  });
  // },

//add or delete subscription
    addRemove: function(opts, cb){
        sails.log.debug('opts data', opts);
        sails.log.debug('opts',opts.followers);
        sails.log.debug('opts',opts.following);
        // Subscription.findOne({followers: opts.followers, following: opts.following, category_id: opts.category_id}).exec(function(err, unsub){  //for subscribe the category of the user
        Subscription.findOne({followers: opts.followers, following: opts.following }).exec(function(err, unsub){
            // console.log('<-------------->err',err, '<-------------->followers',unsub );
            if(!err && unsub){
                Subscription.destroy({id: unsub.id}).exec(function(err, unsub){
                    if(!err){
                      cb(null, unsub);
                      // console.log('unsub');
                    } else{
                      cb(err);
                      // console.log('unsub err');
                    }
                })
            } else{
                Subscription.create(opts).exec(function(err, sub){
                    if(!err){
                        // console.log('r88888888888888888888888888888888',opts.followers);
                        Subscription.count({following: opts.following }).exec(function(err, user){
                            console.log('r88888888888888888888888888888888',user);
                        })
                        cb(null, sub);
                    }else{
                        cb(err);
                    }
                });
            }
        });
    },


    getFollowingList: function(opts, cb){
        Subscription.find({ following: opts }).exec(function(err, followings){
            // console.log(followers);
            if(!err){
                var followingIds = [];
                // console.log(followings);
                for (var i=0; i < followings.length; i++){
                    followingIds.push(followings[i].followers);

                    // console.log('hmm',followings[i].followers);
                    // console.log(followingIds);
                }
                // console.log(followingIds);
                cb(null, followingIds);
            } else{
                cb(err);
            }
        });
    },

    followrsAndFollwing: function(opts, cb){
        var user_subscription = {};

        Subscription.count({following: opts}).exec(function(err, user_following){
            if(!err){
                user_subscription.following = user_following;
            } else{
                cb(err);
            }
        });

        Subscription.count({followers: opts}).exec(function(err, user_followers){
            if(!err){
                user_subscription.followers = user_followers;
                cb(null, user_subscription);
                // console.log('Subscription count',user_subscription);
            } else{
                cb(err);
            }
        });
    }




};

