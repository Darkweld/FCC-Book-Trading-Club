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
		.find({'bookId': {$in: arr}})
		.populate('user', 'localUsername')
		.exec(function(err, doc) {
			if (err) throw err;
			
			if (!doc.length) {
				resolve(array);
			}

			arr = [];

			for (var j = 0, l = doc.length; j < l; j++) {
				arr[j] = doc[j].bookId;
			}

			function fil(val) {
				return arr.indexOf(val.bookId) === -1
			}

			array = array.filter(fil);



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
	
	this.bookFind = function(req, res) {
		res.render('books', {user: req.user});
	};

	this.createUsername = function(req, res) {
		if (req.isAuthenticated()) {
		return res.render('username');
	}
		return res.render('login');

	};
	this.checkUsername = function(req, res) {

		if (!req.params.username) {
			return res.json({'error': 'please enter a username'});
		}

		if (/\W/.test(req.params.username) || req.params.username.length > 20) {
			return res.json({'error': 'please enter a valid username'})
		}

		User
		.find({'localUsername' : req.params.username})
		.then(function(doc) {
			if (doc.length) {
				return res.json({'error': 'that username is already taken'});
			}

			User
			.update({'_id': req.user._id}, {'localUsername': req.params.username})
			.exec(function(err, result) {
					if (err) throw err;
					return res.json({'success': 'your username is now changed'});

			});


		}).catch(function(reject){
			console.log('error in finding username thenable, reason: ' + reject);
		})


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
		
    	
    	User
			.findOne({'_id': req.user._id}).exec()
			.then(function(doc) {
				if (doc.books.length >= 5) return res.json({'error': "you may not have more than 5 books at a time. Remove or trade with others!"});
				Books
					.findOne({'bookId': req.query.bookId})
					.exec(function(err, result){
						if (err) throw err;
						if (result) return res.json({'error': "that book is already claimed"});
						var book = new Books({
							bookId: req.query.bookId,
							title: req.query.title,
							authors: [req.query.authors],
							image: req.query.image,
							user: req.user._id
						});
						book.save().then(function(bookDoc) {
							User.update({'_id': req.user._id}, {$push: {books :bookDoc._id}})
							.exec(function(err, userDoc) {
								res.json({'query':'completed'});
							});
							
						}).catch(function(reason) {
				console.log('error in book saving function, reason: ' + reason);
			});
						
					});
			}).catch(function(reason) {
				console.log('error in book saving function, reason: ' + reason);
			})
		
    	
    };
    this.bookListIndex = function(req, res){
    	Books
    	.find({})
    	.populate('user', 'localUsername')
    	.exec(function(err, doc){
    		if (err) throw err;
    		res.json(doc);
    	});



    };
    this.requestPage = function(req, res) {
    	//if (req.params.user === req.user.localUsername) return res.redirect('/profile');
    	//if (!req.params.user) return res.redirect ('/');


    	User.findOne({'localUsername': req.params.user})
    	.exec(function(err, doc){
    			if (err) throw err;
    				res.render('request', {reciever : doc, requester: req.user});
    	});


    };
    
    
    
    
    
    
}
module.exports = server;
