/**
* Tips.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title: { type: 'string' },
    description: { type: 'string' },
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
  // category_list: function (cb) {
  //    Category.find().exec(function(err, category){
  //     // sails.log.debug(category)
  //     if(err)
  //       cb(err);
  //     else
  //       cb(null, category);
  //    })
  // }

  category_edit: function(opts, cb) {
    Category.findOne().exec(function(err, categories){
       sails.log.debug(categories)
      if (err)
        cb(err);
      else 
        update({id: "" })
        cb(null, categories)
    })
  },


  // category_delete: function(opts, cb) {
  //   Category.delete(opts).exec(function(err, category){
  //     if (err)
  //       cb(err);
  //     else 
  //       .remove()
  //       cb(null, category)
  //   })
  // }
};