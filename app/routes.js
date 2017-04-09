// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	var slug = require('slug');
	app.get('/', function(req, res) {
		//console.log(slug('địt con mẹ cộng sản ăn cứt','-'));
		res.render('index.ejs',{
			user : req.user // get the user out of session and pass to template
		}); // load the index.ejs file
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

	app.get('/post',function(req,res){
		res.render('newpost.ejs',{
			user : req.user // get the user out of session and pass to template
		});
	});
	app.post('/post',function(req,res){
		console.log(req.body.title);
		console.log(req.body.thumbnail);
		console.log(req.body.content);
		console.log(req.body.id);
		//var insertQuery = "insert into users(username,password,role,email,fullname)values('" + newUserMysql.username +"','"+ newUserMysql.password +"',null,null,null) RETURNING id";
        // pool.query(insertQuery,function(err, rows) {
        //      if (err)
        //         return done(err);
        //     newUserMysql.id = rows.rows[0].id;
        //     return done(null, newUserMysql);
        // });
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
