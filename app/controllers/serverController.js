'use strict';

var User = require('../models/user');
var Books = require('../models/books');
var https = require('https');

function apiBookRequest(val) {
	return new Promise(function (resolve, reject) {
		var options = {
    	hostname: 'www.googleapis.com',
    	path: '/books/v1/volumes?q=' + val + '&maxResults=40&printType=books&projection=lite'
		 },
    
	   apiServerRequest = https.request(options, function(response) {
    	var json = "";
    	response.on('data', function(data) {
    		json += data;
    	});
    	response.on('end', function() {
    		json = JSON.parse(json);
    		var count = 0;
    		var arr = [];
    		for (var i in json.items) {
    			arr[count] = {
    				bookId: json.items[i].id,
    				title: json.items[i].volumeInfo.title,
    				authors: json.items[i].volumeInfo.authors,
    				image: json.items[i].volumeInfo.imageLinks.thumbnail.replace(/http/, 'https')
    			};
    			count++;
    			
    		}
    		resolve(arr);
  
    	});
    	response.on('error', function(err) {
    		reject(err);
    	});
	  });
    
    apiServerRequest.end();
    	
    	
    	
});
}
function findBooks (array) {
	return new Promise(function(resolve, reject) {
		
	var arr = [];
	
	for (var i = 0, l = array.length; i < l; i++) {
		arr[i] = array[i].bookId;
	}
	
	Books
		.find({'bookID': {$in: arr}})
		.exec(function(err, doc) {
			if (err) throw err;
			
			console.log(doc + "length: " + doc.length);
			
			if (!doc.length) {
				resolve(array);
			}
			
			for (var j = 0, l = doc.length; j < l; j++) {
				if (arr.indexOf(doc[j].title) !== -1) {
					array.splice(j, 1);
				}
			}
			
			array = {ownedBooks: doc, unownedBooks: array};
			
			resolve(array);
			
		});
	
		
	});

}






function server (passport) {
	this
		.checkTokens = function(req, res){
			var obj = (req.user).toObject();
		if	(obj.tokens) return res.render('profile', { user: req.user });
		req.logout();
		return res.redirect('/login');
		};
    this
        .githubRoute = passport.authenticate('github');
    
    this
        .githubCallback = passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/login' });
	
	this
	    .googleRoute = passport.authenticate('google', { scope: ['profile'] });
	    
	this
	    .googleCallback = passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login' });
	
	this
	    .twitterRoute = passport.authenticate('twitter');
	    
	this
	    .twitterCallback = passport.authenticate('twitter', {
		successRedirect: '/',
		failureRedirect: '/login' });
	
	this
	    .facebookRoute = passport.authenticate('facebook');
	    
	this
	    .facebookCallback = passport.authenticate('facebook', {
		successRedirect: '/',
		failureRedirect: '/login' });
	
	this.unlinkGithub = function(req, res) {
		var currentUser = req.user;
			currentUser.tokens.github = undefined;
			currentUser.save(function(err,doc){
				if (err) throw err;
				res.redirect("/profile");
			});
	};
	
	this.unlinkGoogle = function(req, res) {
		var currentUser = req.user;
			currentUser.tokens.google = undefined;
			currentUser.save(function(err){
				if (err) throw err;
				res.redirect("/profile");
			});
	};
	
	this.unlinkTwitter = function(req, res) {
		var currentUser = req.user;
			currentUser.tokens.twitter = undefined;
			currentUser.save(function(err){
				if (err) throw err;
				res.redirect("/profile");
			});
	};
	
	this.unlinkFacebook = function(req, res) {
		var currentUser = req.user;
			currentUser.tokens.facebook = undefined;
			currentUser.save(function(err){
				if (err) throw err;
				res.redirect("/profile");
			});
	};
	this.deleteAccount = function(req, res) {
		User
			.findByIdAndRemove({'_id': req.user._id})
			.exec(function(err, doc){
				if (err) throw err;
				res.redirect('/index');
			});
	};
	
	this.booksLogin = function(req, res) {
		res.render('books', {user: req.user});
		
		
		
		
		
		
	};
    
    
    this.bookSearch = function(req, res) {
    	
    	if (!req.query.q) {
    		return res.json({'error': 'please enter a book name'});
    	}
    	
    	var test = req.query.q;
    	
    	if (/[^a-zA-Z0-9\ \-\_\.]|^[\ \-\_\.]|[\ \-\_]$|[\ \-\_\.]{2,}?/g.test(test)) {
    		return res.json({'error': 'please enter a valid book name'});
    	}
    	
    	test = test.replace(/\ /, "+");
		
    	
    	apiBookRequest(test).then(function(resolve) {
    		findBooks(resolve).then(function(val) {
    			
    		res.json(val);
    			
    		});
    	}).catch(function(reason) {
    		res.json({error: 'error in api call, reason: ' + reason});
    	});

    }; 
    
    this.addBook = function(req, res) {
		
		console.log(req.query);
    	
    	res.json({hello:'hello'});
    	
    };
    
    
    
    
    
    
}
module.exports = server;