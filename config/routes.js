var Index = require('../app/controllers/indexController')
var User = require('../app/controllers/userController')
var Movie = require('../app/controllers/movieController')
var _ = require('underscore');


module.exports = function(app){

//预处理
app.use(function(req,res,next){
	app.locals.user = req.session.user
	next()
})

app.get('/',Index.index)

app.get('/movie/new',Movie.newa)
app.get('/movie/update/:id',Movie.update)
app.post('/movie/new',Movie.save)
app.get('/movie/list',Movie.list)
app.delete('/movie/delete',Movie.del)
app.get('/movie/detail/:id',Movie.detail)


app.post('/user/signup',User.signup)
app.post('/user/signin',User.signin)
app.get('/user/logout',User.logout)
app.get('/user/list',User.list)
// app.get('/signin',User.showSignin)
// app.get('/signup',User.showSignup)

}