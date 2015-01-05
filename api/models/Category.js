/**
* Categories.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title: { type: 'string' },
    description: { type: 'string' },
  },

  index: function  (opts, cb) {
  	Category.find().exec(function(err, category){
  		if(err)
  			cb (err);
  		else
  			cb(null, category);
  	});
  }
};

