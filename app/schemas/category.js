var mongoos = require('mongoose')

var ObjectId = mongoos.Schema.Types.ObjectId

var CategorySchema = new mongoos.Schema({
	name: String,
	movies:[{type: ObjectId , ref : 'Movie'}],
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

CategorySchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createdAt = this.updatedAt = Date.now()
	}
	else
		this.meta.updatedAt = Date.now()
	next()
})

CategorySchema.statics = {
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



module.exports = CategorySchema