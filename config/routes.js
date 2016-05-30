var Index = require('../app/controllers/indexController')
var User = require('../app/controllers/userController')
var Movie = require('../app/controllers/movieController')
var Comment = require('../app/controllers/commentController')
var Category = require('../app/controllers/categoryController')
var _ = require('underscore');


module.exports = function(app){

//预处理
app.use(function(req,res,next){
	app.locals.user = req.session.user
	next()
})

//index
app.get('/',Index.index)


//movie
app.get('/movie/new',User.signinRequired, User.adminRequired,Movie.newa)
app.get('/movie/update/:id',User.signinRequired, User.adminRequired,Movie.update)
app.post('/movie/new',User.signinRequired, User.adminRequired,Movie.save)
app.get('/movie/list',User.signinRequired, User.adminRequired, Movie.list)
app.delete('/movie/delete',User.signinRequired, User.adminRequired,Movie.del)
app.get('/movie/detail/:id',Movie.detail)

//user
app.post('/user/signup',User.signup)
app.post('/user/signin',User.signin)
app.get('/user/logout',User.logout)
app.get('/user/list',User.signinRequired, User.adminRequired,User.list)
app.get('/signin',User.showSignIn)
app.get('/signup',User.showSignUp)



//comments
app.post('/user/comment',User.signinRequired , Comment.save)

//category
app.get('/category/list',User.signinRequired,User.adminRequired, Category.list)
app.post('/category/new',User.signinRequired,User.adminRequired, Category.save)
app.get('/category/new',User.signinRequired,User.adminRequired, Category.new)
app.get('/category/update/:id',User.signinRequired,User.adminRequired, Category.update)
app.delete('/category/delete',User.signinRequired, User.adminRequired,Category.del)
app.get('/category/showmovie',Index.search)

}