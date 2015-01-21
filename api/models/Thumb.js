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
  	Thumb.create(opts).exec(function(err, up){
  		if(err)
  			cb(err);
  		else
  			cb(null, up);
  	})
  },

  updateThumbs: function(tipId){
  	Thumb.count({tip_id: tipId, thumbs: 'up'}).exec(function(err, upCount){
  		if(!err){
  			Tip.findOne({id: tipId}).exec(function(err, tip){
  				if(!err){
  					tip.thumbs_up = upCount;
  					Tip.update({id: tipId}, tip).exec(function(err, tips){
  						//done
  					});
  				}
  			});
  		}
  	});
  	Thumb.count({tip_id: tipId, thumbs: 'down'}).exec(function(err, upCount){
  		if(!err){
  			Tip.findOne({id: tipId}).exec(function(err, tip){
  				if(!err){
  					tip.thumbs_down = upCount;
  					Tip.update({id: tipId}, tip).exec(function(err, tips){
  						//done
  					});
  				}
  			});
  		}
  	});
  },

  downVote: function (opts, cb) {
  	Thumb.create(opts).exec(function(err, down){
  		if(err)
  			cb(err);
  		else
  			cb(null, down);
  	})
  },

};