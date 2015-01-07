/**
* Tips.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title: { 
      type: 'string'
    },
    description: {
      type: 'string' 
    },
    created_by: { 
      type: 'string', 
      required: true 
    },
    category_list: { 
      required: true ,
      type: 'string' , 
      in: ['unix', 'mac', 'windows']
    },
  },
  
  category_add: function (opts, cb) {
    // sails.log.debug(opts);
  	Category.create(opts).exec(function(err, category){
  	    if(err)
          cb(err);
      else
        cb(null, category);
    });
  },

  category_edit: function(id, opts, cb) {
    Category.update({id: id}, opts, function(err, category){
      if (err)
        cb(err);
      else 
        cb(null, category);
    })
  },

  category_delete: function(id, cb) {
    Category.destroy({id: id}).exec(function(err, category){
      if(err)
        cb(err);
      else
        cb(null, category);
    });
  },

  // list: function(opts, cb){

  // },

  add: function(opts, cb) {
    Tips.create(opts).exec(function(err, tips){
      if(!err && tips){
        return cb(null, tips); 
      }
      else{
        return cb(err);
      }
    })
  },
};