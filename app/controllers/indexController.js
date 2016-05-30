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

exports.search = function(req,res){

	var catID = req.query.cat
	var page = req.query.p
	var countPpage = 2
	var index = page * countPpage

	Category
		.findOne({_id : catID})
		.populate({
			path: 'movies',
			select : 'title poster'
		})
		.exec(function (err,category){
			if(err){
				console.log(err);
			}
			else {
 				var movies = category.movies || []
				var results = movies.slice(index, index + countPpage)
				res.render('category_search',{
					keyWord : category.name || '' ,
					title:'分类结果',
					totlePage : Math.ceil( movies.length / countPpage),
					currentPage : page,
					movies:results
				})
			}
		})
}