'use strict';

var path = process.cwd();
var Server = require(path + "/app/controllers/serverController.js");

module.exports = function(app, passport) {
    
    
    function userLoggedIn (req, res, next) {
     if (req.isAuthenticated() && req.user.localUsername) return next(); 
     if (req.isAuthenticated()) return res.redirect('/username') ;
        return res.redirect('/login'); 
    }
    var server = new Server(passport);
    
    app.route("/")
        .get(function(req, res) {
            res.render('index', { user: req.user });
        });
        
    app.route('/login')
        .get(function(req, res) {
            if (req.isAuthenticated()) { res.redirect('/profile'); } else { res.render('login'); }
        });
        
     app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });

    app.route('/username')
        .get(server.createUsername);

    app.route(['/checkUsername','/checkUsername/:username'])
        .post(server.checkUsername);
        
    app.route('/profile')
        .get(userLoggedIn, server.checkTokens);
        
    app.route('/auth/github')
        .get(server.githubRoute);
        
    app.route('/auth/github/callback')
    	.get(server.githubCallback);
	
	app.route('/auth/google')
        .get(server.googleRoute);
        
    app.route('/auth/google/callback')
    	.get(server.googleCallback);
	
	app.route('/auth/twitter')
        .get(server.twitterRoute);
        
    app.route('/auth/twitter/callback')
    	.get(server.twitterCallback);
	
	app.route('/auth/facebook')
        .get(server.facebookRoute);
        
    app.route('/auth/facebook/callback')
	    .get(server.facebookCallback);
	
	app.route('/unlink/github')
	    .get(userLoggedIn, server.unlinkGithub);
	
	app.route('/unlink/google')
	    .get(userLoggedIn, server.unlinkGoogle);
	    
	app.route('/unlink/twitter')
	    .get(userLoggedIn, server.unlinkTwitter);
	    
	app.route('/unlink/facebook')
	    .get(userLoggedIn, server.unlinkFacebook);
    
    app.route('/delete')
        .delete(userLoggedIn, server.deleteAccount);
    
    app.route('/getUser')
        .get(server.userPage);

    app.route('/bookListIndex')
        .get(server.bookListIndex);
        
    app.route('/findBooks')
        .get(userLoggedIn, server.bookFind);

    app.route('/bookSearch')
        .get(server.bookSearch);
        
    app.route('/addBook')
        .post(server.addBook);

    app.route(['/request', '/request/:user'])
        .get(userLoggedIn, server.requestPage);

    app.route('/makeRequest')
        .post(server.makeRequest);

    app.route('/deleteBook/:book')
        .post(server.deleteBook);

    app.route('/myRequests')
        .get(userLoggedIn, function(req, res){
            res.render('myRequests');
        });
    app.route('/myRequestsController')
        .get(server.myRequests);

    app.route('/deleteRequest/:request')
        .post(server.deleteRequest)

    app.route('/acceptRequest/:request')
        .post(server.acceptRequest)
};