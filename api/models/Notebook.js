/**
* Notebook.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        notebook_name: { 
            type: 'string',
            required: true ,
        },
        created_by: { 
            type: 'string',
            required: true ,
        },
        tip_ids:{
          type: 'array'
        }
    },
  

    add: function(opts, cb) {
        // console.log(opts);
        Notebook.create(opts).exec(function(err, mynb){
          if(!err && mynb){
            return cb(null, mynb);
          } else {
            return cb(err);
          }
        })
    },

    edit: function(id, opts, cb) {
        // console.log("Opts", opts);

        var tipId = opts["tip_id"];

        if(tipId){
            Notebook.find({id: id, created_by: opts["user_id"]}, function(err, notebook){
            // console.log("Found notebook for the user", err, notebook);
            if(err){
                cb(err);
            } else {
              var existingTipIds = notebook[0] && notebook[0]["tip_ids"];
              // console.log("esingfsdgsgs", existingTipIds);

              if(existingTipIds){
                if(existingTipIds.indexOf(tipId) == -1){
                    existingTipIds.push(tipId);
                } else {
                    existingTipIds.splice(existingTipIds.indexOf(tipId), 1);
                }
              } else {
                existingTipIds = [tipId]
              }
              
              delete(opts["tip_id"]);
              opts["tip_ids"] = existingTipIds;
              //opts["tip_ids"] = [];

              // console.log("Final Opts", opts);

              Notebook.update({id: id}, opts, function(err2, notebook){
                if(!err2){
                    cb (null, notebook);
                } else{
                    cb(err2);
                }
              });
            }
          });
        } else {
            Notebook.update({id: id}, opts, function(err2, notebook){
                if(!err2){
                    cb (null, notebook);
                } else{
                    cb(err2);
                }
            });
        }
    },

    //remove notebook
    notebook_remove: function(opts, cb){
        // console.log('remove',opts)
        Notebook.destroy({id: opts}).exec(function(err, notebookRemove){
            if(err){
                return cb(err);
            } else {
                return cb( null, notebookRemove);
            }
        })
    },

    notebook_list: function(opts, cb){
        // console.log('---------------N B------------',opts);
        Notebook.find({created_by: opts}).exec(function(err, notebook){
            // console.log("Finding notebooks", err, notebook);
            if (err) {
               return cb (err);
            }  else {
                // console.log('before send nb',notebook );
                cb (null, notebook);
            }
        });
    },


};