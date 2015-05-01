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

    // upVote: function (opts, cb) {
    //   	Thumb.create(opts).exec(function(err, up){
    //       	if(err){
    //             cb(err);
    //         } else{
    //             cb(null, up);
    //         }
    //     })
    // },

    // downVote: function (opts, cb) {
    //     Thumb.create(opts).exec(function(err, down){
    //         if(err){
    //             cb(err);
    //         } else {
    //             cb(null, down);
    //         }
    //     })
    // },





    // updateThumbs: function(tipId){
    //   	Thumb.count({tip_id: tipId, thumbs: 'up'}).exec(function(err, upCount){
    //   		if(!err){
    //   			Tip.findOne({id: tipId}).exec(function(err, tip){
    //   				if(!err){
    //   					tip.thumbs_up = upCount;
    //   					Tip.update({id: tipId}, tip).exec(function(err, tips){
    //   						  console.log("which ..", tip)
    //               //done
    //   					});
    //   				}
    //   			});
    //   		}
    //   	});
    //   	Thumb.count({tip_id: tipId, thumbs: 'down'}).exec(function(err, downCount){
    //   		if(!err){
    //   			Tip.findOne({id: tipId}).exec(function(err, tip){
    //   				if(!err){
    //   					tip.thumbs_down = downCount;
    //   					Tip.update({id: tipId}, tip).exec(function(err, tips){
      						
    //                         //done
    //   					});
    //   				}
    //   			});
    //   		} else {
    //             console.log('INFO: err ', err)
    //         }
    //   	});
    // },

    
    vote: function(opts, cb){
        //find an existing thumb or not
        // console.log("Options", opts);
        var tip_id  = opts.tip_id,
            user_id = opts.user_id,
            vote    = opts.thumbs;

        var tip_params = {};

        Thumb.findOne({user_id: user_id, tip_id: tip_id}).exec(function(err, thumb){
            // console.log('Info: model thumb', user_id,'tip_id', tip_id, "thumb", thumb);
            //if existing, 
            if(thumb){
                // console.log("Thumb found", thumb.thumbs, "parameter given", vote);
                // Compare the existing thumb with the passed parameter
                if(thumb.thumbs == vote){
                    // Delete the thumb and downgrade one count
                    deleteThumb(thumb, function(err, isDeleted){
                        if(isDeleted){
                            Tip.findOne({id: tip_id}).exec(function(err, tip){
                                console.log("Found tip ???", tip);
                              if(!err && tip){

                                var thumb_param = {},
                                    upCount, downCount;

                                if(vote == "up"){
                                    upCount   = tip.thumbs_up - 1;
                                    thumb_param["thumbs_up"] = upCount;
                                } else {
                                    downCount   = tip.thumbs_down - 1;
                                    thumb_param["thumbs_down"] = downCount;
                                }
                                // update Tip

                                console.log("------------------------------What was the upcount", tip.thumb_param);
                                console.log("------------------------------What was the upcount", thumb_param);


                                var upCount = tip.thumbs_up - 1;
                                Tip.update({id: tip.id}, thumb_param).exec(function(err, tip){
                                   // console.log("Updating the Tip", tip);
                                   cb(null, tip);
                                 });
                              }
                            });
                        }
                    })
                } else {
                    // Toggle
                    updateThumb(thumb.id, { thumbs: vote }, function(err, isUpdated){
                        if(isUpdated){
                            Tip.findOne({id: tip_id}).exec(function(err, tip){
                              if(!err){

                                var thumb_param = {},
                                    upCount, downCount;

                                if(vote == "up"){
                                    upCount   = tip.thumbs_up + 1;
                                    downCount   = tip.thumbs_down - 1;

                                    thumb_param["thumbs_up"] = upCount;
                                    thumb_param["thumbs_down"] = downCount;
                                } else {

                                    //get err
                                    upCount   = tip.thumbs_up - 1;
                                    downCount   = tip.thumbs_down + 1;

                                    thumb_param["thumbs_up"] = upCount;
                                    thumb_param["thumbs_down"] = downCount;
                                }

                                var upCount   = tip.thumbs_up + 1,
                                    downCount = tip.thumbs_down - 1;

                                Tip.update({id: tip.id}, thumb_param).exec(function(err, tip){
                                   // console.log("Updating the Tip", tip);
                                   cb(null, tip);
                                });
                              }
                            }); 
                        }
                    })

                }
            } else {
                // Create a thumb
                // console.log("Creating Thumb..");

                Thumb.create(opts).exec(function(err, thumb){
                    // console.log("Created Thumb..", thumb);

                    if(err){
                        cb(err);
                    } else{
                        Tip.findOne({id: tip_id}).exec(function(err, tip){
                            console.log("Finding tip.. \n", "Found:", tip);
                              if(!err && tip){
                                var thumb_param = {},
                                    upCount, downCount;

                                if(vote == "up"){
                                    if(isNaN(tip.thumbs_up)){
                                        upCount   = 1;
                                    } else {
                                        upCount   = tip.thumbs_up + 1;
                                    }
                                    // set thumbsup params
                                    thumb_param["thumbs_up"] = upCount;
                                } else {
                                    // set thumbsdown params
                                    if(isNaN(tip.thumbs_down)){
                                        downCount   = 1;
                                    } else {
                                        downCount   = tip.thumbs_down + 1;
                                    }
                                    // set thumbsup params
                                    thumb_param["thumbs_down"] = downCount;
                                }
                                // update Tip

                                // console.log("What was the upcount", tip.thumb_param);
                                
                                Tip.update({id: tip.id}, thumb_param).exec(function(err, tip){
                                   console.log("Updated the Tip", tip);
                                   cb(null, tip);
                                });
                              }
                        }); 
                    }
                })

            }
          
        });
    }
};

var deleteThumb = function(thumb, cb){
    // console.log(":Delere");
    // Delete here
    Thumb.destroy({id: thumb.id}).exec(function(err, deletedThumb){
        // console.log("After Destroy: ", deletedThumb);
        if(err){
            cb(err);
        } else {
            cb(null, deletedThumb);
        }
    });
} 

var updateThumb = function(thumb_id, thumb, cb){
    // console.log("Update Thumb!!!");
    Thumb.update({id: thumb_id}, thumb, function(err, updatedThumb){
        if(err){
            cb(err, null);
        } else {
            cb(null, updatedThumb);
        }
    })
}