var mongoos = require('mongoose')
// var bcrypt = require('bcrypt')
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10

var UserSchema = mongoos.Schema({
	name: {
		type: String,
		unique: true
	},
	password : {
		type: String,
	},

	meta:{
		createdAt:{
			type: Date,
			default: Date.now()
		},
		updatedAt:{
			type: Date,
			default: Date.now()
		}
	}
})

UserSchema.pre('save',function(next){
	var user = this
	if(this.isNew){
		this.meta.createdAt = this.updatedAt = Date.now()
	}
	else
		this.meta.updatedAt = Date.now()

	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err) return next(err);

		bcrypt.hash(user.password , salt ,null, function(err,hash){
			if(err) return next(err);
			user.password = hash
			next()
		})
	})
})

UserSchema.methods = {
	comparePassword : function(_password, cb){
		bcrypt.compare(_password,this.password,function(err,isMatched){
			cb(err,isMatched)
		})
	}
}

UserSchema.statics = {
	fetch: function (cb){
		return this
			.find({})
			.sort('meta.updatedAt')
			.exec(cb)
	},
	findById: function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	},
	findByName: function(namein,cb){
		return this
		.findOne({name:namein})
		.exec(cb)
	}
}



module.exports = UserSchema