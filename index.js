var pg = require('pg');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');


var express = require("express");
var app = express();


app.use(express.static('public'))

app.get("/",function(req,res){
  res.render("index");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret : "secret",
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.user.findById(id).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        console.log(err);
    })
});

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

passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

         pool.query("SELECT * FROM `users` WHERE `username` = '" + email + "'",function(err,rows){
      if (err)
                return done(err);
       if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            } 
      
      // if the user is found but the password is wrong
            if (!(passwordHash.verify(password,rows[0].password)))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
      
            // all is well, return successful user
            return done(null, rows[0]);     
    
    });
    


    }));

};




app.set("view engine","ejs");
app.set("views","./views");
app.listen(3000,function(){
	console.log("Listed on port 3000");
	 // var hashedPassword = passwordHash.generate('123456');

  //   console.log(passwordHash.verify('123456',hashedPassword)); 
});

router.route('/login')
    .get(function (req, res) {
        res.render('login')
    })
    post('/login', passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login' }));


