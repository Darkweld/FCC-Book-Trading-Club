'use strict';

(function() {
var form = document.getElementById('Username');
var formval = document.getElementById('usernameValue');

form.addEventListener('submit', function(event) {
	event.preventDefault();

	xhttp.request('POST', mainUrl + '/checkUsername/' + formval.value, function(data) {

		console.log(data);



	});



}, false)



})();