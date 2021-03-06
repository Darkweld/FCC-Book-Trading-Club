'use strict';

var User = require('../models/user');
var Books = require('../models/books');
var Requests = require('../models/requests');
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
    			if (!json.items[i].volumeInfo.imageLinks) continue;
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
		return res.render('username', {user: req.user});
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
					return res.json({'success': req.params.username});

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
			.findOne({'_id': req.user._id})
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
								res.json({'completed':'query'});
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
    	if (req.params.user === req.user.localUsername) return res.redirect('/profile');
    	if (!req.params.user) return res.redirect ('/');


    	User.findOne({'localUsername': req.params.user}, {'localUsername': 1, 'books': 1})
    	.populate('books')
    	.then(function(reciever){
    	User
    		.findOne({'_id': req.user._id}, {'localUsername': 1, 'books': 1, 'requestsRecieved': 1})
    		.populate('books')
    		.exec(function(err, requester){
    			if (err) throw err;
    			res.render('request', {userRequests: req.user.requestsRecieved, reciever: JSON.stringify(reciever), requester: JSON.stringify(requester)})
    		})
    	}).catch(function(reason){
    		console.log('error in requestPage findOne, reason: ' + reason);
    	});


    };
    
    this.makeRequest = function(req, res){
    	if (!req.query.recBooks && !req.query.reqBooks) return res.json({'error': "no books chosen. click books to add them to make a request"});

    	var recLength;
    	var reqLength;
    	var recBooks = req.query.recBooks.split(',');
    	var reqBooks = req.query.reqBooks.split(',');

    	if (recBooks[0] === "")  { recLength = 0; recBooks = []; } else { recLength = recBooks.length; }
    	if (reqBooks[0] === "") { reqLength = 0; reqBooks = []; } else { reqLength = reqBooks.length; }

    	User
    	.findOne({'_id': req.query.recID})
    	.then(function(doc){
    		if (doc.requestsRecieved.length >= 10) return res.json({'error': "that user's request inbox is full"});
    		if ((doc.books.length + reqLength - recLength) > 5) return res.json({'error': "a user may not have more than 5 books at a time"});

    		User
    			.findOne({'_id': req.query.reqID})
    			.then(function(doc2) {
    				if (doc2.requestsSent.length >= 10) return res.json({'error': "you have too many pending requests. Wait or delete some pending requests."});
    				if ((doc2.books.length + recLength - reqLength) > 5) return res.json({'error': "a user may not have more than 5 books at a time"});

    				var request = new Requests({
    					booksRequested: recBooks,
    					from: doc2._id,
    					booksOffered: reqBooks,
    					to: doc._id
    				});

    				request.save().then(function(requestDoc){
    					User.update({'_id': doc._id}, {$push: {requestsRecieved: requestDoc._id}}).then(function(userDoc){
    						User.update({'_id': doc2._id}, {$push: {requestsSent: requestDoc._id}})
    						.exec(function(err){
    							if (err) throw err;
    							return res.json({requestDoc});
    						})	
    					}).catch(function(reason){
    		console.log('error in updating user, reason: ' + reason)
    		});


    				}).catch(function(reason){
    		console.log('error in saving request/users, reason: ' + reason)
    		});

    			}).catch(function(reason){
    		console.log('error in findOne user requester, reason: ' + reason)
    		});

    	}).catch(function(reason){
    		console.log('error in findOne user reciever, reason: ' + reason)
    	})

    };
	
	this.userPage = function(req, res) {
		User
			.findOne(req.user._id)
			.populate('books')
			.exec(function(err, doc){
				if (err) throw err;
						res.json(doc)
			})
	};   

	this.deleteBook = function(req, res){
		User
		.update({'_id': req.user._id},{$pull: {'books': req.params.book}})
		.then(function(doc){
			Books
				.remove({'_id': req.params.book},function (err){
					if (err) throw err;
					return res.send('completed');
				});

		}).catch(function(reason){
			console.log('error removing from bookarray in deletebook, reason: ' + reason);
		});
	};

	this.myRequests = function(req, res){
		User
			.findOne({'_id': req.user._id}, {'localUsername': 1, 'books': 1, 'requestsSent': 1, 'requestsRecieved': 1})
			.populate('requests')
			.populate({path: 'requestsRecieved',
				populate: [{
					path: 'from', select: 'localUsername books'
				},
				{
					path: 'booksOffered'
				},
				{
					path: 'booksRequested'
				}]
			})
			.populate({path: 'requestsSent',
				populate: [{
					path: 'to', select: 'localUsername books'
				},
				{
					path: 'booksOffered'
				},
				{
					path: 'booksRequested'
				}]
			})
			.exec(function(err, doc){
				if (err) throw err;
				return res.json(doc);
			});
	};

	this.deleteRequest = function(req, res){

		Requests
			.findOne({'_id': req.params.request})
			.populate('from')
			.then(function(doc){
				if (req.user._id.toString() !== doc.to.toString() && req.user._id.toString() !== doc.from._id.toString()) return res.json({error: 'invalid user'});
				User
					.update({'_id': doc.to}, {$pull: {'requestsRecieved': req.params.request}})
					.then(function(userUpdate){
						User
							.update({'_id': doc.from._id}, {$pull: {'requestsSent': req.params.request}})
							.then(function(userUpdate2){
								Requests
									.remove({'id_': req.params.request}, function(err){
									if (err) throw err;
									return res.send('completed');
							});
							}).catch(function(reason){
						console.log('error in  user update, reason: ' + reason);
					});
					}).catch(function(reason){
						console.log('error in  user update, reason: ' + reason);
					});
			}).catch(function(reason){
				console.log('error in request.findOne, reason: ' + reason);
			});

	};

	this.acceptRequest = function(req, res){

		Requests
			.findOne({'_id': req.params.request})
			.populate('from')
			.then(function(doc){
				if (req.user._id.toString() !== doc.to.toString()) return res.json({error: 'invalid user'});
					var l = doc.booksRequested.length;
					var k = doc.booksOffered.length;

				if ((req.user.books.length + k - l) > 5 || (doc.from.books.length + l - k) > 5) return res.json({error: 'a user may not have more than 5 books at a time'})

				for (var i = 0; i < l; i++){
					if (req.user.books.indexOf(doc.booksRequested[i]) === -1) {
						return res.json({error: 'You no longer have some of the books in this request.'});
						break;
					}
				}
				for (var j = 0; j < k; j++){
					if (doc.from.books.indexOf(doc.booksOffered[j]) === -1) {
						return res.json({error: 'Requester no longer has some of the books in this request'});
						break;
					}
				}


		Books
			.update({'_id': {$in: doc.booksOffered}}, {$set: {'user': doc.to}}, {multi: true})
			.then(function(){
			Books
				.update({'_id': {$in: doc.booksRequested}}, {$set: {'user': doc.from._id}}, {multi: true})
				.then(function(){
				User
					.update({'_id': doc.to}, {$push: {'books': {$each: doc.booksOffered}}})
					.then(function(){
				User
					.update({'_id': doc.to}, {$pull: {'requestsRecieved': req.params.request, 'books': {$in: doc.booksRequested}}})
					.then(function(){
						User
							.update({'_id': doc.from._id}, {$push: {'books': {$each: doc.booksRequested}}})
							.then(function(){
						User
							.update({'_id': doc.from._id}, {$pull: {'requestsRecieved': req.params.request, 'books': {$in: doc.booksOffered}}})
							.then(function(){
								Requests
									.remove({'id_': req.params.request}, function(err){
									if (err) throw err;
									return res.send('completed');
							});
							}).catch(function(reason){
						console.log('error in  user update push 2, reason: ' + reason);
							});
							}).catch(function(reason){
						console.log('error in  user update 2, reason: ' + reason);
					});
					}).catch(function(reason){
						console.log('error in  user update push, reason: ' + reason);
					});
					}).catch(function(reason){
						console.log('error in  user update, reason: ' + reason);
					});
			}).catch(function(reason){
				console.log('error in book update2, reason: ' + reason);
			});
		}).catch(function(reason){
				console.log('error in book update1, reason: ' + reason);
			});
	}).catch(function(reason){
				console.log('error in request.findOne, reason: ' + reason);
			});


	};
    
    

}
module.exports = server;
