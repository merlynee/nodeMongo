var Comment = require('../models/comment')

exports.index = function(req,res){
	Comment.fetch(function(err,movies){
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

exports.save = function(req,res){
	var _comment = req.body.comment
	var _movieId = _comment.movie

	if(_comment.cid){
		console.log(_comment.cid);
		Comment.findById(_comment.cid,function(err,comment){
			var reply = {
				from: _comment.from,
				to : _comment.tid,
				content: _comment.content
			}
			console.log(_comment);
			if(!reply.from)
				return
			comment.reply.push(reply)
			comment.save(function(err,comment){
				if(err){
					console.log(err);
				}else{
					res.redirect('/movie/detail/' + _movieId)
				}
			})
		})
	}else{
		var comment = new Comment(_comment)
		comment.from = req.session.user._id
		console.log("from:"+comment.from);

		comment.save(function(err,comment){
			if(err){
				console.log(err);
			}else{
				res.redirect('/movie/detail/' + _movieId)
			}
		})
	}
}