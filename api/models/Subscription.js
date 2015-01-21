/**
* Subscription.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  attributes: {
    category_id : { 
      required: true
    },
    created_by: { 
      type: 'string', 
      required :true 
    },
    user_id: { 
      type: 'string',
      required :true 
    },
  },

  beforeValidate: function(params, next){
   if(!params.category_id) 
    return next();
   Category.findOne(params.category_id).exec(function(err, category){
      if(err || !category) 
        return next(Error('Category Not Found')); 
      else 
        return next();
   });
  },

  add: function(opts, cb){
    sails.log.debug(opts);
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

