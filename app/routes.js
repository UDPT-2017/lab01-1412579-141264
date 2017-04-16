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

	const pool = new pg.Pool(config);
	var fs = require('fs');
	var dateFormat = require('dateformat');
	var now = new Date();
	const nodemailer = require('nodemailer');
	var slug = require('slug');



	let transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: 'iuemanhngatxiu@gmail.com',
	        pass: '1345314bommy'
	    }
	});

	app.get('/', function(req, res) {
		// fs.unlink('public/images/90x60-1.jpg', function(err){
		//     if (err) console.log(err);
		// });
		
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
					list : result ,
					nav: 1
				}); 
			});

			
		});
	});

	app.get('/blog',function(req,res){
		pool.connect(function (err) {
		  if (err) return console.log(err);

			  // execute a query on our database
			  pool.query('SELECT * FROM post,users where post.iduser = users.id ORDER BY idpost DESC OFFSET 0 LIMIT 4', function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    // disconnect the client
			    res.render('blog.ejs',{
					user : req.user,
					list : result ,
					nav: 2
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
			user : req.user,
			nav : 0
		});
	});

	app.get('/listpost/:id', isLoggedIn, function(req, res) {
		if(req.user.id != req.params.id)
			return res.redirect('/dashboard');
		pool.connect(function (err) {
		  if (err) return console.log(err);

			  // execute a query on our database
			  pool.query('SELECT * FROM post where post.iduser = '+ req.params.id, function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    // disconnect the client
			    res.render('listpost.ejs',{
					user : req.user,
					list : result,
					nav : 0
				}); 
			});

			
		});
	});

	app.get('/post', isLoggedIn ,function(req,res){
		res.render('newpost.ejs',{
			user : req.user ,
			nav : 0
		});
	});

	app.get('/edit/:id', isLoggedIn ,function(req,res){
		pool.connect(function (err) {
		  if (err) return console.log(err);

			  // execute a query on our database
			  pool.query('SELECT * FROM post where post.idpost = '+ req.params.id, function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    // disconnect the client
			    res.render('editpost.ejs',{
					user : req.user,
					post : result.rows[0],
					nav : 0
				}); 
			});

			
		});
	});

	app.post('/edit/:id', upload.single('thumbnail'), function(req,res){
		//console.log('first test:' + JSON.stringify(req.file));
		if(!req.file.filename){
			var updateQuery = "update post set title ='" + 
			req.body.title + " ', slug = '" + 
			slug(req.body.title,"-") + "',content = '" + 
			req.body.content + "'" +
			"where idpost = " + req.params.id;
	        pool.query(updateQuery,function(err, rows) {
	             if (err)
	                return console.log(err);     
	            res.redirect('/listpost/'+req.user.id);
	        });
		}
		else{
			console.log(req.file.filename);
			var updateQuery = "update post set title ='" + 
			req.body.title + " ', slug = '" + 
			slug(req.body.title,"-") + "',content = '" + 
			req.body.content + "',thumbnail = '" + 
			req.file.filename + "'" +
			"where idpost = " + req.params.id;
	        pool.query(updateQuery,function(err, rows) {
	             if (err)
	                return console.log(err);     
	            res.redirect('/listpost/'+req.user.id);
	        });
		}

		
	});



	app.get('/del/:id',function(req,res){
		pool.connect(function (err) {
		  if (err) return console.log(err);

			  // execute a query on our database
			  pool.query('update post set thumbnail = null where post.idpost = '+ req.params.id, function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    // disconnect the client
			    res.redirect('/edit/' + req.params.id);
			});
		});
	})



	app.post('/comment', function(req,res){
		var id = req.body.id;
		var idpost = req.body.idpost;
		var content = req.body.content;
		pool.connect(function (err) {
		  if (err) return console.log(err);

			  // execute a query on our database
			  pool.query("insert into comment(idpost,id,content) values ('" + idpost + "','" + id  + "','" + content + "')" , function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }

			    pool.query("select * from users where id=" + req.body.idauthor , function (err, rows) {
				    if (err) {
				    	res.end();
				    	return console.log(err);
				    }
				    // setup email data with unicode symbols
					let mailOptions = {
					    from: '"Mini SNS 👻 Push Email Comment" <iuemanhngatxiu@gmail.com>', // sender address
					    to: rows.rows[0].email, // list of receivers
					    subject: 'Hello ✔, someone was comment in your post!!!', // Subject line
					    text: 'Someone comment in your post!!!', // plain text body
					    html: '<b>Hello world - Ahihi đồ ngốc!!</b>' // html body
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions, (error, info) => {
					    if (error) {
					        return console.log(error);
					    }
					    console.log('Message %s sent: %s', info.messageId, info.response);
				    	res.redirect(req.get('referer'));
					});
			    });

			});
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
			    	return console.log("post: " + err);
			    }
			    ///console.log(result.rows[0].slug);
			    pool.query("SELECT * FROM comment,users where comment.idpost=" + id +" and comment.id = users.id ", function (err, comment) {
				    if (err) {
				    	res.end();
				    	return console.log("comment: " + err);
				    }
				    
				    
				    res.render('post.ejs',{
				    	user : req.user,
						post : result.rows[0],
						cmt: comment,
						nav: 2
					}); 
				});
			});
		});
	});


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

	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/login'
        }));


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
