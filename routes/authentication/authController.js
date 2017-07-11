/**
 * Created by kimiseob on 2017. 7. 9..
 */
var express = require('express');
var router = express.Router();

module.exports = function(passport) {
    router.get('/', function(req, res){
        res.render('test.html');
    });

    router.get('/login', function(req, res){
        res.render('login.html', {message : req.flash('loginMessage')});
    });

    router.post('/login', function(req, res){
        //do something for session control !!


        /////////////////////////////////////
        passport.authenticate('local-login', {
            successRedirect : url, // redirect to the secure profile section
            failureRedirect : '/users/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        })(req,res);
    });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.get('/signup', function(req, res){
        res.render('signup.html', {message : req.flash('signupMessage')});
    });

    router.post('/signup', function(req, res){
        //do something for session control !!


        /////////////////////////////////////
        passport.authenticate('local-signup', {
            successRedirect : url, // redirect to the secure profile section
            failureRedirect : '/users/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        })(req,res);
    });
    router.get('/profile', function(req, res) {
        res.render('profile.html');
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    router.get('/auth/facebook', function(req, res){
        possport.authenticate('facebook',{
            scope : ['email'],
            state : req.query.id
        })(req, res);
    });

    router.get('/auth/facebook/callback', function(req, res){
        passport.authenticate('facebook', {
            successRedirect : url,
            failureRedirect : '/login'
        })(req, res);
    });

    // =======================================
    // KAKAO ROUTES ==========================
    // =======================================
    // route for kakao authentication and login
    router.get('/auth/kakao', function(req, res){
        passport.authenticate('kakao',{
            failureRedirect : '/login',
            failureFlash : true,
            state : req.query.id
        })(req, res);
    });

    router.get('/auth/kakao/oauth', function(req, res){
        //do something for session control !!


        /////////////////////////////////////
        passport.authenticate('kakao',{
            successRedirect : url,
            failureRedirect : '/login'
        })(req,res);
    });



    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
    router.get('/connect/local', function(req, res) {
        res.render('connect-local.html', { message: req.flash('loginMessage') });
    });
    router.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/users/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    router.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/',
            failureRedirect : '/users'
        }));


    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    router.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/users/profile');
        });
    });

    // facebook -------------------------------
    router.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/users/profile');
        });
    });


    return router;
}