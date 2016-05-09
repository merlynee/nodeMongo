var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = Schema({
	movie:{
		type: ObjectId,
		ref: 'movie'
	},
	from : {type: ObjectId, ref: 'user'},
	reply: [{
		from : {type: ObjectId, ref: 'user'},
		to : {type: ObjectId, ref: 'user'},
		content: String
	}],
	to : {type: ObjectId, ref: 'user'},
	content : String,
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

CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createdAt = this.updatedAt = Date.now()
	}
	else
		this.meta.updatedAt = Date.now()
	next()
})

CommentSchema.statics = {
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
	}
}



module.exports = CommentSchema