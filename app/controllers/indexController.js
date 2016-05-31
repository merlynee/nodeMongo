var Movie = require('../models/movie')
var Category = require('../models/category')
var Consts = require('../models/appconst')

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

	var q = req.query.q
	var catID = req.query.cat
	var page = req.query.p
	var index = page * Consts.MovieCountPerCategory || 0

	if(catID){
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
					var results = movies.slice(index, index + Consts.MovieCountPerCategory)
					res.render('search',{
						keyWord : category.name || '' ,
						query: 'cat=' +catID,
						title:'分类结果',
						totalPage : Math.ceil( movies.length / Consts.MovieCountPerCategory),
						currentPage : page,
						movies:results
					})
				}
			})
	}else {
		Movie
			.find({title: new RegExp('.*'+q+'.*','i')})
			.exec(function (err, movies) {
				if (err) {
					console.log(err);
				}
				else {
					var results = movies.slice(index, index + Consts.MovieCountPerCategory)
					res.render('search', {
						keyWord: q,
						query: 'q=' + catID,
						title: '搜索结果',
						totalPage: Math.ceil(movies.length / Consts.MovieCountPerCategory),
						currentPage: page,
						movies: movies
					})
				}
			})
	}
}