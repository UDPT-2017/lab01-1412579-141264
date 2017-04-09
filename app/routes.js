// app/routes.js

module.exports = function(app, passport) {

	//loading pg and config postgresql server
	var pg = require('pg');
	var config = {
	  user: 'postgres', //env var: PGUSER
	  database: 'lab01', //env var: PGDATABASE
	  password: '1345314', //env var: PGPASSWORD
	  host: 'localhost', // Server hosting the postgres database
	  port: 5432, //env var: PGPORT
	  max: 10, // max number of clients in the pool
	  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
	};

	const pool = new pg.Pool(config);
	var fs = require('fs');
	var dateFormat = require('dateformat');
	var now = new Date();
	var slug = require('slug');
	app.get('/', function(req, res) {
		pool.connect(function (err) {
		  if (err) return console.log(err);

			  // execute a query on our database
			  pool.query('SELECT * FROM post,users where post.iduser = users.id ORDER BY idpost DESC OFFSET 0 LIMIT 2', function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    // disconnect the client
			    res.render('index.ejs',{
					user : req.user,
					list : result 
				}); 
			});

			
		});
	});

	//show login form
	app.get('/login', Logged, function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// post login
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to homepage if user logged
            failureRedirect : '/login', // redirect back to the loggin page if fail
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            //console.log("hello");
            //remember me
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/'); //redirect to Home
    });

	//Sign Up form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// post signup
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/login', // redirect to login if success,  auto login and back to home
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/dashboard', isLoggedIn,function(req,res){
		res.render('dashboard.ejs',{
			user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/post', isLoggedIn ,function(req,res){
		res.render('newpost.ejs',{
			user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/post/:id/:slug',function(req,res){
		var id = req.params.id;
		pool.connect(function (err) {
		  if (err) return console.log(err);
		  	//update view of post
	  		pool.query("update post set view=view+1 where post.idpost=" + id, function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			});
			  // execute a query on our database
			pool.query("SELECT * FROM post,users where post.idpost=" + id +" and post.iduser = users.id ", function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    ///console.log(result.rows[0].slug);
			    
			    res.render('post.ejs',{
			    	user : req.user,
					post : result.rows[0]
				}); 
			});

			
		});

	});

	//multer help upload fille quickly, it image here
	var multer  = require('multer')
		
	var storage = multer.diskStorage({
	    destination: function (req, file, cb) {
	        cb(null, 'public/images/')
	    },
	    filename: function (req, file, cb) {
	        cb(null, Date.now() +"-" + file.originalname);
	  }
	})

	var upload = multer({ storage: storage })

	//post add new post using body-parser and upload with multer
	app.post('/post', upload.single('thumbnail'), function(req,res){
		//console.log('first test:' + JSON.stringify(req.file));
		//console.log(thumbnailPath);
		var insertQuery = "insert into post(title,slug,content,thumbnail,iduser,view,date)values('" +
		req.body.title +"','"+ 
		slug(req.body.title,"-") +"','"+ 
		req.body.content +"','"+ 
		req.file.filename +"','"+
		req.body.id + "','"+
		0 + "','"+
		dateFormat(now, "dddd, mmmm dS, yyyy, HH:MM ") +
		"')";
        pool.query(insertQuery,function(err, rows) {
        	
             if (err)
                return console.log(err);     
            res.redirect('/post');
           
        });
	});

	// Log out
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

function Logged(req, res, next) {

	// if user isnt authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they are redirect them to the home page
	res.redirect('/');
}
