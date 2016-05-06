var Movie = require('../models/movie')

exports.index = function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		else {
			res.render('index',{
				title:'首页',
				movies:movies
			})
		}
	})
}