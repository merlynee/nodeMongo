var User = require('../models/user')


//用户登录注册

//注册
exports.signup = function(req,res){
	var _user = req.body.user
	console.log(_user.name);
	User.findByName(_user.name,function(err,user){
		if(err) console.log(err);
		if(user) {
			return res.redirect('/signup')
		}else{
			user = new User(_user)
			user.save(function(err,user){
			if(err) console.log(err);
				console.log(user);
			// app.locals.user = user
			res.redirect('/')
			})
		}
	})
}

//登录
exports.signin = function(req,res){

	var _user = req.body.user

	User.findByName(_user.name,function(err,user){
		if(err){
			console.log('login err');
		}
	 			
 		if(!user){
 			console.log('no user,login failed');
 			return res.redirect('/signup')
 		} 				
		else{
			user.comparePassword(_user.password,function(err,isMatched){
				if(err)
	 				console.log(err);
 				if(isMatched){
 					console.log('login success');
 					req.session.user = user
 					// app.locals.user = user
					return res.redirect('/')
 				}else{
 					console.log('login failed');
 					return res.redirect('/signin')
 				}
			})
		}
	})
}


exports.logout = function(req,res){
	delete req.session.user
	// delete app.locals.user
	res.redirect('/')
}

exports.list = function(req,res){

	User.fetch(function (err,users){
		if(err)
	 			console.log(err);
 		res.render('userList',{
 			users : users
 		})
	})
}

exports.showSignUp = function(req,res){
		res.render('signup',{
			title: '新用户注册'
		})
}

exports.showSignIn = function(req,res){
		res.render('signin',{
			title: '用户登录'
		})
}


exports.signinRequired = function(req,res,next){
	var user = req.session.user
	if(!user){
		return res.redirect('/signin')
	}
	next()
}

exports.adminRequired = function(req,res,next){
	var user = req.session.user
	if(!user.role || user.role !== 'admin'){
		return res.redirect('/signin')
	}
	next()
}