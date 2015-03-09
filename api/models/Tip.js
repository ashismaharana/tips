/**
* Tip.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        title: { 
          type: 'string',
          required: true ,
        },
        description: {
          type: 'string', 
          required: true ,
        },
        created_by: { 
          type: 'string', 
          required: true ,
        }
    },
  
    category_add: function (opts, cb) {
        // sails.log.debug(opts);
      	Category.create(opts).exec(function(err, category){
          console.log("INFO: Result of saving a category", err, category);
      	    if(err) {
              cb(err);
            } else {
              cb(null, category);
            }
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

    add: function(opts, cb) {
        console.log(opts);
        var tip = opts;
        tip["thumbs_up"] = 0;
        tip["thumbs_down"] = 0;
        tip["view"] = 0;

        Tip.create(tip).exec(function(err, tip){
          if(!err && tip){
            return cb(null, tip); 
          }
          else{
            return cb(err);
          }
        })
    },

    edit: function(id, opts, cb) {
        Tip.update({id: id}, opts, function(err, category){
          if (err)
            cb(err);
          else 
            cb(null, category);
        })
    },

    delete: function(id, cb) {
        Tip.destroy({id: id}).exec(function(err, category){
          if(err)
            cb(err);
          else
            cb(null, category);
        });
    },

    list: function(opts, cb){
        Tip.find(opts).exec(function(err, tip){
            if(err){
                cb (err);
              }
            else{
                cb(null, tip);
            }
        });
    },

    topUserTips: function(opts, cb){
        Tip.find(opts).limit(5).sort({thumbs_up: 'desc'}).exec(function(err, tip){
            if (err) {
                console.log('err',err);
                cb (err);
            } else{
            console.log(tip);
                console.log('tip',tip);
                cb(null, tip);
            };
        })
    },

    view: function(tipId, cb){
        Tip.findOne( {id: tipId}).exec(function(err, tip){
            if(!err){
                tip["view"] = tip.view + 1;
                // console.log(tip.view);
                Tip.update({id: tipId}, tip,function(err, tips){
                    if(err){
                        cb(err);
                    }
                    else{
                        cb(null, tips);
                    }
                })
            } else{
                cb(err);
            }
        })
    }

};