// app/routes.js
module.exports = function(app, passport) {
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
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	var slug = require('slug');
	app.get('/', function(req, res) {
		pool.connect(function (err) {
		  if (err) return console.log(err);

			  // execute a query on our database
			  pool.query('SELECT * FROM post ORDER BY idpost DESC OFFSET 0 LIMIT 2', function (err, result) {
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

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', Logged, function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/dashboard',function(req,res){
		res.render('dashboard.ejs',{
			user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/post', isLoggedIn ,function(req,res){
		res.render('newpost.ejs',{
			user : req.user // get the user out of session and pass to template
		});
	});

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

	app.post('/post', upload.single('thumbnail'), function(req,res){
		//console.log('first test:' + JSON.stringify(req.file));
		thumbnailPath = '<img src = "images/' + req.file.filename +'">';
		//console.log(thumbnailPath);
		var insertQuery = "insert into post(title,slug,content,thumbnail,id)values('" +
		req.body.title +"','"+ 
		slug(req.body.title,"-") +"','"+ 
		req.body.content +"','"+ 
		thumbnailPath +"','"+
		req.body.id +"')";
        pool.query(insertQuery,function(err, rows) {
             if (err)
                return console.log(err);     
            res.redirect('/post');
           
        });
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
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

	// if user is authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
