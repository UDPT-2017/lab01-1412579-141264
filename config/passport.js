// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;


var bcrypt = require('bcrypt-nodejs');


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

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        pool.query("SELECT * FROM users WHERE id = '"+id+"'", function(err, rows){
            done(err, rows.rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            pool.query("SELECT * FROM users WHERE username = '" + username + "'", function(err, rows) {
                if (err)
                    return done(err);
                if (rows.rows.length > 0) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } 
                else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "insert into users(username,password,role,email,fullname)values('" + newUserMysql.username +"','"+ newUserMysql.password +"',null,null,null) RETURNING id";
                    pool.query(insertQuery,function(err, rows) {
                         if (err)
                            return done(err);
                        newUserMysql.id = rows.rows[0].id;
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            pool.query("SELECT * FROM users WHERE username = '" + username + "'", function(err, rows){
                // console.log(rows.rows[0].password);
                // console.log(bcrypt.hashSync(123456, null, null));
                // console.log(rows.rows.length);
                if (err)
                    return done(err);
                if (rows.rows.length < 0) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows.rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows.rows[0]);
            });
        })
    );
};
