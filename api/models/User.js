/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var crypto = require('crypto');

module.exports = {

	attributes: {
		firstName : { type: 'string' },
	    lastName : { type: 'string' },
	    email : { type: 'string', unique: true, required: true},
	    password : { type: 'string' }
	},

	list: function(cb){

    },

	login: function(opts, cb){
	  	User.findOne({email: opts.email}).exec(function(err, user){
	  		//sails.log.debug(user);
	  		if(!err){
	  			validatePassword(opts.password, user.password, function(res){
	  				if(res)
	  					return cb(null, user);	
	  				else 
	  					return cb(new Error('forbidden'));
	  			});
	  		}else{
	  			return cb(err);
	  		}
		})
	},

	signup: function(opts, cb){
	  	saltAndHash(opts.password, function(hash){
				opts.password = hash;
				// sails.log.debug(opts)
				User.create(opts).exec(function(err, user){
		  		if(!err && user){
		  			return cb(null, user);
		  		}else{
		  			return cb(err);
		  		}
		  	})

	  	})
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