var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var app = express()
var mongoose = require('mongoose')
var moment = require('moment')
var expressSession = require('express-session')
var mongoStore = require('connect-mongo')(expressSession)
var dbURL = 'mongodb://localhost/nodeMongo'
var db = mongoose.connect(dbURL)
var morgan = require('morgan')


app.locals.moment = require('moment')
app.set('views','./app/views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(expressSession({
	secret : 'merlynee',
	store: new mongoStore({
		url: dbURL
		,collection: 'sessions'
	}),
	resave:false,
	cookie: {maxAge : 1000 * 60 * 60 * 24 * 7}, //7天cookie
	saveUninitialized: true 
}))


if('development' === app.get('env')){
	app.set('showStackError' , true)
	app.use(morgan(':method :url :status'))
	// app.locals.pretty = true
	mongoose.set('debug',true)
}
require('./config/routes')(app)
app.listen(port)
console.log('Server Started:' + port );