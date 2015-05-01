/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var crypto = require('crypto');
var random 	   = require("random-js")();

module.exports = {

	attributes: {
		firstName : { type: 'string', required: true },
		lastName : { type: 'string' },
	    email : { type: 'string', unique: true, required: true},
	    password : { type: 'string', required: true},
	    followers : { type: 'string'},
	    following : {type: 'string'}
	    // following : {type: 'integer', autoIncrement: true , defaultsTo: '0'}
	},

	list: function(cb){

    },

	login: function(opts, cb){
	  	User.findOne({email: opts.email}).exec(function(err, user){
	  		//sails.log.debug(user);
	  		if(!err){
	  			if(user){
				  	validatePassword(opts.password, user.password, function(res){
		  				if(res){
		  					return cb(null, user);	
		  				} else {
		  					//return cb(new Error('forbidden'));
		  					return cb("Error: Either email / password is wrong", null)
		  				}
	  				});
	  			} else {
		  			return cb("Error: User not found!!", err)
	  			}
	  			
	  		}else{
	  			return cb('err baba',err);
	  		}
		})
	},

	signup: function(opts, cb){
		// console.log("OPTS", opts);
	  	saltAndHash(opts.password, function(hash){
				opts.password = hash;
				opts.image = "default.jpeg";
				sails.log.debug(opts)
				User.create(opts).exec(function(err, user){
		  		if(!err && user){

		  			return cb(null, user);
		  		}else{
		  			return cb(err);
		  		}
		  	})

	  	})
	},


	updateProfile: function(opts,cb){
		User.update({email: opts.email}, opts, function(err, updateUser){
			if(!err && updateUser){
	  			return cb(null, updateUser);
	  		}else{
	  			return cb(err);
	  		}
		})
	},

// add Image
	addImage: function(opts, cb){
  		var image = opts.data;
  		var user_id = opts.user_id;

  		//var ext = image.substring(image.indexOf('/')+1, image.indexOf(";"));
  		var ext = opts.ext;

        image = image.replace(/^data:image\/png;base64,/, "");
        image = image.replace(/^data:image\/jpg;base64,/, "");
        image = image.replace(/^data:image\/jpeg;base64,/, "");

        image = new Buffer(image, 'base64');
        
        var doc = {};
        doc.name = opts.user_id + '-' + (random.integer(1, 100000)) + '.jpeg';
        doc.data = image;

        AWSService.upload(doc, function(err, res){
        	if(!err){
        	console.log('After upload image res :',res);
        	var oldImg = {};
        	    User.findOne({id: opts.user_id}).exec(function(err, user){
		        	if(!err){
        	    		oldImg = user.image;
						user.image = doc.name;
						// console.log('--------------------user----------------', user);
			    		User.update({id: opts.user_id}, user).exec(function(err, updatedUser){
			    			console.log("Actual update of user :", err, updatedUser[0].image);
			    			if(!err){
			    				cb(null, updatedUser[0]);
			    			}
			    			else{
			    				cb(err);
			    			}
			    		});
        	    		console.log('User old image:',oldImg);
			    		AWSService.delete(oldImg, function(err,res){
			    			console.log('AWS delete res', err, res);
			    		})
		        	}

		        })

        	} else{
        	console.log('After upload image AWS err',err);
        	}


        });
  	},

}//module exports end

//signup, login password encryption and validatePassword
var generateSalt = function(){
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback){
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback){
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(hashedPass === validHash);
}//end password encryption and validatePassword
