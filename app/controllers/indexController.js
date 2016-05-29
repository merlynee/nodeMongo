var Movie = require('../models/movie')
var Category = require('../models/category')

exports.index = function(req,res){

	Category
		.find({})
		.populate({path: 'movies',options : {limit : 5}})
		.exec(function (err,categories){
			if(err){
				console.log(err);
			}
			else {
				res.render('index',{
					title:'首页',
					categories:categories
				})
			}
		})
}