/**
* Thumbs.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/



module.exports = {

  attributes: {
    tip_id: { 
      type: 'string',
      required: true,
    },
    user_id: { 
      type: 'string', 
      required: true, 
    },
    thumbs: { 
	  type: 'string', 
	  required: true,
	},
  },

  upVote: function (opts, cb) {
  	Thumbs.create(opts).exec(function(err, up){
  		if(err)
  			cb(err);
  		else
  			cb(null, up);
  	})
  },

  updateThumbs: function(tipId){
  	Thumbs.count({tip_id: tipId, thumbs: 'up'}).exec(function(err, upCount){
  		if(!err){
  			Tips.findOne({id: tipId}).exec(function(err, tip){
  				if(!err){
  					tip.thumbs_up = upCount;
  					Tips.update({id: tipId}, tip).exec(function(err, tips){
  						//done
  					});
  				}
  			});
  		}
  	});
  	Thumbs.count({tip_id: tipId, thumbs: 'down'}).exec(function(err, upCount){
  		if(!err){
  			Tips.findOne({id: tipId}).exec(function(err, tip){
  				if(!err){
  					tip.thumbs_down = upCount;
  					Tips.update({id: tipId}, tip).exec(function(err, tips){
  						//done
  					});
  				}
  			});
  		}
  	});
  },

  downVote: function (opts, cb) {
  	Thumbs.create(opts).exec(function(err, down){
  		if(err)
  			cb(err);
  		else
  			cb(null, down);
  	})
  },

};