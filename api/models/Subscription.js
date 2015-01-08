/**
* Subscription.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  types: {
    isValidCategoryId: function(id, cb){
      return Category.findOne({id: id}).exec(function(err, user){
        if(err || !user)
          return cb(false);
        else{
          return cb(true);
        }  
      });
    }
  },
  
  attributes: {
    category_id : { isValidCategoryId: function(result){console.log(result)}, required: true, type: 'string' },
    created_by: { type: 'string', required :true },
    user_id: { type: 'string',required :true },

  },

  add: function(opts, cb){
    Subscription.create(opts).exec(function(err, sub){
      if(err)
        cb(err);
      else
        cb(null, sub);
    })  
  },

  remove: function(opts, cb){
    Subscription.destroy(opts).exec(function(err, unsub){
      if(err)
        cb(err);
      else
        cb(null, unsub);
    })
  },
};

