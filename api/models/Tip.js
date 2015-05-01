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
        // thumbs_up:{
        //   type: 'string', 
        //   defaultsTo: '0',
        // },
        // thumbs_down:{
        //   type: 'string', 
        //   defaultsTo: '0',
        // },
        // view:{
        //   type: 'string', 
        //   defaultsTo: '0',
        // }
    },
  
    category_add: function (opts, cb) {
        // sails.log.debug(opts);
      	Category.create(opts).exec(function(err, category){
          // console.log("INFO: Result of saving a category", err, category);
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
        // console.log(opts);
        var tip = opts;
        tip["thumbs_up"] = 0;
        tip["thumbs_down"] = 0;
        tip["view"] = 0;

        Tip.create(tip).exec(function(err, tip){
          if(!err && tip){
            delete tip['suggest'];
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
          else{
            cb(null, category[0]);
          } 
        })
    },

    delete: function(id, cb) {
        Tip.findOne({id: id}).exec(function(err, category){
            if(category){
                Tip.destroy({id: id}).exec(function(err, category){
                    if(err){
                      cb(err);
                    }
                    else{
                      cb(null, {massage: 'Deleteed'});
                    }
                });
            }else{
                // console.log('err',err);
                cb(new Error(404));
          }
        })
    },

    list: function(opts, cb){
        // console.log("Options:", opts);
        Tip.find(opts).sort({createdAt: 'desc'}).exec(function(err, tips){
            if(err){
                cb (err);
              }
            else{
                
                Notebook.find({created_by: opts.created_by}, function(err, notebooks){
                   if(err){
                      cb("Error fetching tip data");
                   } else {
                      cb(null, tips);
                      
                      // var notebooks = notebooks;
                      // var notebookLookup = {};

                      // // console.log("All Notebooks ", notebooks);

                      // for(var i in notebooks){
                      //   // console.log("  Each notebook", notebooks[i]);
                      //   notebookLookup[notebooks[i].id] = notebooks[i].tip_ids;
                      // }

                      // // console.log("Note Book", notebookLookup);

                      // for(var i in tips){
                      //   var tip = tips[i];
                      //   // console.log("tip ", i, tip);

                      //   tip.notebook_ids = [];
                      //   for(var notebook_id in notebookLookup){
                      //       // console.log("NB Id >> ", notebook_id, notebookLookup[notebook_id]);

                      //       var tipIds = notebookLookup[notebook_id];
                            
                      //       // console.log("<><><><><>Tip Ids()()()()", tipIds);

                      //       if(tipIds && ( tipIds.indexOf(tip['id']) != -1 )){
                      //         tip.notebook_ids << notebook_id;
                      //       } else {
                      //         tip.notebook_ids << "sdfkdsjgfds";  
                      //       }
                      //       // console.log("INFO::: TIP is", tip);
                      //   }
                      //   tips[i] = tip;
                      // }
                      // // console.log("Final", tips)
                      // cb(null, tips);
                   }
                });
            }
        });
    },

    topUserTips: function(opts, cb){
        Tip.find(opts).limit(5).sort({thumbs_up: 'desc'}).exec(function(err, tip){
            if (err) {
                // console.log('err',err);
                cb (err);
            } else{
            // console.log(tip);
                // console.log('tip',tip);
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
    },

// user dashboard
    userTipView: function(userId, cb){
        Tip.find({created_by:  userId}).exec(function(err, tip){
            // console.log(tip)
            // console.log(tip[0])
            
            var userDash = {}
            if(!err && tip){
                
                var tipNum = tip.length;
                var viewer = 0;
                var tUpNum = 0;
                var tDownNum = 0;
                // var rewards = 0;


                for(i=0; i < tip.length; i++ ){
                    // console.log(tip[4].view)
                    // console.log(tip[0])
                    var view = tip[i].view;
                    var thumbs_up = tip[i].thumbs_up;
                    var thumbs_down = tip[i].thumbs_down;


                    // console.log(num)

                    viewer = viewer + view;
                    tUpNum = tUpNum + thumbs_up;
                    tDownNum = tDownNum + thumbs_down;
                    // cb(null, tip); //total tips
                }
                if(viewer >= 5){
                    rewards = viewer / 5 
                }
                userDash.tip=tipNum;
                userDash.viewer=viewer;
                userDash.thumbs_up=tUpNum;
                userDash.thumbs_down=tDownNum;
                userDash.rewards=rewards;

                cb(null, userDash);

            }
        });
    },

    afterCreate: function(newlyInsertedRecord, cb){
      var clone = JSON.parse(JSON.stringify(newlyInsertedRecord)); 
      ElasticSearchService.index(null, clone, function(){
        cb();
      });
    },

    afterUpdate: function(newlyUpdatedRecoed, cb){
      var clone = JSON.parse(JSON.stringify(newlyUpdatedRecoed)); 
      ElasticSearchService.update(null, clone);
      cb();
    },

    afterDestroy: function(destroyedRecords, cb){
      var clone = JSON.parse(JSON.stringify(destroyedRecords));
      var ids = [];
      ids.push(clone[0].id);
      ElasticSearchService.delete(null, ids);
      cb();
    },

    regenerateESIndex: function(ids){
        var condition = {};
        if(ids && ids.length > 0)
          condition.id = ids;

        Tip.find(condition).exec(function(err, tips){
          var i = 0;
          var fn = function(){
            // sails.log.debug('tip i value in es = '+i);
            var tip = tips[i++];
            ElasticSearchService.index(null, tip, function(){
              // sails.log.debug('regenerated es index for '+ tip.id);

              if(i < tips.length){
                fn();
              }
            });
          };
          
          fn();
        });
    },

    suggest: function(term, cb){
    // var terms = term.split(" ");
        // sails.log.debug('in models '+term);
        ElasticSearchService.suggest(null, term, function(err, suggestions){
          if(err)
            cb(err);
          else{
            cb(null, suggestions);
          }
        });
    },

    search: function(query, cb){
      ElasticSearchService.search(null, query, function(err, results){
        if(err)
          cb(err);
        else{
          var tipsResponse = [];
          // console.log('INFO: Search results:',results.hits);
          for(var i=0; i<results.hits.length; i++){
              var src = results.hits[i]["_source"];
              delete(src["suggest"]);
              tipsResponse.push(src);
          }
          // console.log('INFO: Search results:',tipsResponse);
          cb(null, tipsResponse);
        }
      });
    }
};