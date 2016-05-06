var Movie = require('../models/movie')
var _ = require('underscore')


exports.detail = function(req,res){
	var id = req.params.id
	if(!id.match(/^[0-9a-fA-F]{24}$/)){
		console.log('err ID');
		return;
	}
	Movie.findById(id, function(err,movie){
		if(err){
			console.log('err4:'+err);
		}
		else {
			res.render('detail',{
				title:'Movie:' + movie.title,
				movie: movie
			})
		}
	})
}

exports.newa = function(req,res){

	console.log('in news');
	res.render('admin',{
		title:'录入页',
		movie:{
			doctor: '',
			country: '',
			title: '',
			year: '',
			language: '',
			flash: '',
			summary: '',
			poster: ''
		}
	})
}


exports.update = function(req,res){
	var id = req.params.id
	if(id)
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title: '更新',
				movie: movie
			})
		})
	else
		console.log('更新：无效ID');
}



//admin  post movie
exports.save = function(req,res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if (id != 'undefined'){
		 Movie.findById(id, function(err,movie){
		 	if(err)
		 		console.log('err1:'+err);
		 	_movie = _.extend(movie,movieObj)
		 	_movie.save(function(err,movie){
		 		if(err)
		 			console.log('err2:'+err);
	 			res.redirect('/movie/detail/' + movie._id)
		 	})
		 })
	}
	else{
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})
		_movie.save(function(err,movie){
	 		if(err)
	 			console.log('err3:'+err);
 			res.redirect('/movie/detail/' + movie._id)
	 	})
	}
}


exports.list = function(req,res){
	console.log('in here');
	Movie.fetch(function (err,movies){
		if(err)
	 			console.log(err);
 		res.render('list',{
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