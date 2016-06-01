var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')



exports.detail = function(req,res){
	var id = req.params.id
	if(!id.match(/^[0-9a-fA-F]{24}$/)){
		console.log('err ID');
		return;
	}
	Movie
		.findOne({_id:id})
		.populate('category','name')
		.exec(function(err,movie){
		if(err){
			console.log('err4:'+err);
		}
		else {
			Movie.update({_id:id},{$inc:{pv:1}},function(err){
				if(err)
					console.log(err)
			})
			Comment
				.find({movie:id})
				.populate('from','name')
				.populate('reply.from reply.to', 'name')
				.exec(function(err,comment){
				if(err){
					console.log('commenterr:'+err);
				}else{
					res.render('detail',{
					title:'Movie:' + movie.title,
					movie: movie,
					comments: comment
					})
				}
			})
		}
	})
}

exports.newa = function(req,res){

	Category.fetch(function(err,categories){
		res.render('admin',{
			title:'录入页',
			categories : categories,
			movie:{
				doctor: '',
				country: '',
				title: '',
				category:'',
				year: '',
				language: '',
				flash: '',
				summary: '',
				poster: ''
			}
		})
	})
}


exports.update = function(req,res){
	var id = req.params.id
	if(id)
		Movie.findById(id,function(err,movie){
			Category.fetch(function(err,categories){
				res.render('admin',{
					title: '更新',
					movie: movie,
					categories : categories
				})
			})
		})
	else
		console.log('更新：无效ID');
}



//admin  post movie
exports.save = function(req,res){
	var movie_id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(req.poster){
		movieObj.poster = req.poster
	}

	//先存category

	var categoryother = req.body.categoryother
	if(categoryother !== ''){
		Category.findOne({name:categoryother},function(err,category){
			if(err)
				console.log(err);
			//新添加的自定义分类
			if(!category){
				var _category = new Category({name: categoryother})
				_category.save(function(err,category){
				if(err)
					console.log(err)
				saveMoviesByCategory(movieObj,category,res)
				})
			}
			else{ //自定义分类之前就有
				saveMoviesByCategory(movieObj,category,res)
			}
		})
	}else{
		Category.findById(movieObj.category,function(err,category){
			saveMoviesByCategory(movieObj,category,res)
		})

	}



}


exports.list = function(req,res){
	Movie.find({})
		.populate('category','name')
		.exec(function(err,movies){
			if(err)
				console.log(err);
			res.render('list',{
				title: '电影列表',
				movies : movies
			})
		})
}

exports.del = function(req,res){
	var id = req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err)
				console.log(err);
			else
				res.json({success:1})
		})
	}
}

exports.savedPoster = function(req,res,next){
	var posterData = req.files.uploadPosterOther
	var filePath = posterData.path
	var originalName = posterData.originalFilename

	if(originalName){
		fs.readFile(filePath,function(err,data){
			var timeStamp = Date.now()
			var type = posterData.type.split('/')[1]
			var postername = timeStamp + '.' + type
			var newPath = path.join(__dirname,'../../public/upload/'+postername)
			fs.writeFile(newPath ,data, function(err){
				req.poster = postername
				next()
			})
		})
	}else{
		next()
	}
}


function saveMoviesByCategory(movieObj,category,res){

	var movie_id = movieObj._id
	var _movie

	if (movie_id !== 'undefined' && movie_id !== '' && movie_id !== undefined){
		Movie.findById(movie_id, function(err,movie){
			if(err)
				console.log('err1:'+err);
			_movie = _.extend(movie,movieObj)
			_movie.category = category._id
			_movie.save(function(err,movie){
				if(err)
					console.log('err2:'+err);
				saveMoviesToCategory(category,movie._id)
				res.redirect('/movie/detail/' + movie._id)
			})
		})
	}
	else{
		_movie = new Movie(movieObj)
		_movie.category = category._id
		_movie.save(function(err,movie){
			if(err)
				console.log('err3:'+err);
			saveMoviesToCategory(category,movie._id)
			res.redirect('/movie/detail/' + movie._id)
		})
	}
}

function saveMoviesToCategory(category,movieId){
	category.movies.push(movieId)
	category.save(function(err,category){
		if(err)
			console.log('err3:'+err);
		else
			console.log(category);
	})
}