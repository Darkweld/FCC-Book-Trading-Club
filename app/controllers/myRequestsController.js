'use strict';

(function(){

	var mainRequestDiv = document.getElementById('myRequestDiv');
	var recievedButtonContainer = document.getElementById('recievedButtonContainer');
	var sentButtonContainer = document.getElementById('sentButtonContainer');

	function makeBookDivs(array, userBookArray) {

		if (!array.length) {
        	var nothingText = document.createElement('p');
        	nothingText.textContent = "Absolutely nothing!";
        	nothingText.className = "nothingText";
        	return nothingText;
        }

        var bookfragment = document.createDocumentFragment();
            
        for (var i = 0, l = array.length; i < l; i++) {

            var bookDiv = document.createElement('div');
            bookDiv.className = "bookDiv";
            

            var bookImage = document.createElement('img');
            bookImage.src = array[i].image;
            bookImage.className = 'bookImage';
            bookDiv.appendChild(bookImage);

            var tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            
            var bookTitle = document.createElement('p');
            bookTitle.textContent = array[i].title;
            bookTitle.className = "bookTitle";
            tooltip.appendChild(bookTitle);
            
            if (array[i].authors) {
                var bookAuthor = document.createElement('p');
                bookAuthor.textContent = array[i].authors[0];
                bookAuthor.className = "bookAuthor";
                tooltip.appendChild(bookAuthor);
            }

            if (userBookArray.indexOf(array[i]._id) === -1) {
            	bookDiv.className = 'notOwnedBookDiv';
            	bookImage.className = 'notOwnedBookImage';
            	tooltip.className = 'notOwnedToolTip';
            	var boldText = document.createElement('p');
            	boldText.textContent = 'User no longer owns book.'
            	boldText.className = "boldText";
            	tooltip.appendChild(boldText);
            }

            bookDiv.appendChild(tooltip);
            
            bookfragment.appendChild(bookDiv);

        }

        return bookfragment;
	}



	function incomingRequestArray(reqArr, books){

		
		if (!reqArr.length){
			var requestText = document.createElement('p');
			requestText.textContent = "You currently do not have any incoming requests.";
			return recievedButtonContainer.appendChild(requestText);
		}


		for (var i = 0, l = reqArr.length; i < l; i++){

			var request = document.createElement('div');
			request.className = "request";

			var recieverDivHolder = document.createElement('div');
			recieverDivHolder.className = 'recieverDivHolder';


			var userLink = document.createElement('a');
			userLink.href = mainUrl + '/request/' + reqArr[i].from.localUsername;
			userLink.className = 'userLink';
			userLink.textContent = reqArr[i].from.localUsername;
			var recieverDivHolderText = document.createElement('p');
			recieverDivHolderText.className = 'myRequestsBigText';
			recieverDivHolderText.appendChild(userLink);
			recieverDivHolderText.innerHTML += " offered these books:";

			var recieverDiv = document.createElement('div');
			recieverDiv.className = 'recieverDiv';
			recieverDiv.appendChild(makeBookDivs(reqArr[i].booksRequested, books));

			recieverDivHolder.appendChild(recieverDivHolderText);
			recieverDivHolder.appendChild(recieverDiv);
			request.appendChild(recieverDivHolder);

			var middleText = document.createElement('p');
			middleText.textContent = "For these books:";
			middleText.className = 'myRequestsBigText';
			request.appendChild(middleText);

			var requesterDivHolder = document.createElement('div');
			requesterDivHolder.className = 'requesterDivHolder';			

			var requesterDiv = document.createElement('div');
			requesterDiv.className = 'requesterDiv';
			requesterDiv.appendChild(makeBookDivs(reqArr[i].booksOffered, reqArr[i].from.books));

			requesterDivHolder.appendChild(requesterDiv);
			request.appendChild(requesterDivHolder);

			var requestName = document.createElement('button');
			requestName.textContent = "Request " + (i + 1);
			requestName.className = 'requestNameButton';

			var acceptButtonDiv = document.createElement('div');
			acceptButtonDiv.className = 'acceptButtonDiv';

			var acceptButton = document.createElement('button');
			acceptButton.className = 'acceptButton';
			acceptButton.textContent = "Accept trade"
			acceptButtonDiv.appendChild(acceptButton);

			var declineButton = document.createElement('button');
			declineButton.className = 'declineButton';
			declineButton.textContent = "Decline trade"
			acceptButtonDiv.appendChild(declineButton);

			request.appendChild(acceptButtonDiv);

			(function(requestNameButton, requestDiv, accept, decline, id) {

				requestNameButton.addEventListener('click', function(event){
					while (mainRequestDiv.hasChildNodes()){
						mainRequestDiv.removeChild(mainRequestDiv.firstChild);
					}

					 mainRequestDiv.appendChild(requestDiv);
				},false);

				accept.addEventListener('click', function(event){
					xhttp.request('POST', mainUrl + '/acceptRequest/' + id, function(data){
						if (data.error) return alert('Error:\n' + data.error);

						while (mainRequestDiv.hasChildNodes()){
						mainRequestDiv.removeChild(mainRequestDiv.firstChild);
					}

					recievedButtonContainer.removeChild(requestNameButton);
					if (recievedButtonContainer.hasChildNodes()){
						for (var o = 0, p = recievedButtonContainer.childNodes.length; o < p; o++) {
							recievedButtonContainer.childNodes[o].textContent = "Request " + (o + 1);
						}
					}

					var text = document.createElement('p');
					text.textContent = "Request accepted.";
					text.className = 'status';
					return mainRequestDiv.appendChild(text);

					});
				},false);

				decline.addEventListener('click', function(event){

					xhttp.request('POST', mainUrl + '/deleteRequest/' + id, function(data){
						if (data.error) return alert('Error:\n' + data.error);

						while (mainRequestDiv.hasChildNodes()){
						mainRequestDiv.removeChild(mainRequestDiv.firstChild);
					}

					recievedButtonContainer.removeChild(requestNameButton);
					if (recievedButtonContainer.hasChildNodes()){
						for (var o = 0, p = recievedButtonContainer.childNodes.length; o < p; o++) {
							recievedButtonContainer.childNodes[o].textContent = "Request " + (o + 1);
						}
					}

					var text = document.createElement('p');
					text.textContent = "Request declined.";
					text.className = 'status';
					return mainRequestDiv.appendChild(text);

					});

				},false);

			})(requestName, request, acceptButton, declineButton, reqArr[i]._id)

			recievedButtonContainer.appendChild(requestName);

		}

	}
	function outgoingRequestArray(reqArr, books){


		if (!reqArr.length){
			var requestText = document.createElement('p');
			requestText.textContent = "You currently do not have any pending outgoing requests.";
			return sentButtonContainer.appendChild(requestText);
		}

		for (var i = 0, l = reqArr.length; i < l; i++){

			var request = document.createElement('div');
			request.className = "request";

			var recieverDivHolder = document.createElement('div');
			recieverDivHolder.className = 'recieverDivHolder';

			var recieverDivHolderText = document.createElement('p');
			recieverDivHolderText.textContent = "You offered these books:";
			recieverDivHolderText.className = 'myRequestsBigText';

			var recieverDiv = document.createElement('div');
			recieverDiv.className = 'recieverDiv';
			recieverDiv.appendChild(makeBookDivs(reqArr[i].booksOffered, books));

			recieverDivHolder.appendChild(recieverDivHolderText);
			recieverDivHolder.appendChild(recieverDiv);
			request.appendChild(recieverDivHolder);

			var middleText = document.createElement('p');
			middleText.textContent = "For these books:";
			middleText.className = 'myRequestsBigText';
			request.appendChild(middleText);

			var requesterDivHolder = document.createElement('div');
			requesterDivHolder.className = 'requesterDivHolder';

			var requesterDivHolderText = document.createElement('p');
			requesterDivHolderText.textContent = "From the user: "
			requesterDivHolderText.className = 'myRequestsBigText';
			var userLink = document.createElement('a');
			userLink.href = mainUrl + '/request/' + reqArr[i].to.localUsername;
			userLink.className = 'userLink';
			userLink.textContent = reqArr[i].to.localUsername;
			requesterDivHolderText.appendChild(userLink);


			var requesterDiv = document.createElement('div');
			requesterDiv.className = 'requesterDiv';
			requesterDiv.appendChild(makeBookDivs(reqArr[i].booksRequested, reqArr[i].to.books));

			requesterDivHolder.appendChild(requesterDiv);
			requesterDivHolder.appendChild(requesterDivHolderText);
			request.appendChild(requesterDivHolder);

			var acceptButtonDiv = document.createElement('div');
			acceptButtonDiv.className = 'acceptButtonDiv';

			var declineButton = document.createElement('button');
			declineButton.className = 'declineButton';
			declineButton.textContent = "Cancel Request";
			acceptButtonDiv.appendChild(declineButton);

			request.appendChild(acceptButtonDiv);

			var requestName = document.createElement('button');
			requestName.textContent = "Request " + (i + 1);
			requestName.className = 'requestNameButton';

			(function(requestNameButton, requestDiv, decline, id) {

				requestNameButton.addEventListener('click', function(event){
					while (mainRequestDiv.hasChildNodes()){
						mainRequestDiv.removeChild(mainRequestDiv.firstChild);
					}

					 mainRequestDiv.appendChild(requestDiv);
				},false);

				decline.addEventListener('click', function(event){

					xhttp.request('POST', mainUrl + '/deleteRequest/' + id, function(data){
						if (data.error) return alert('Error:\n' + data.error);

						while (mainRequestDiv.hasChildNodes()){
						mainRequestDiv.removeChild(mainRequestDiv.firstChild);
					}

					sentButtonContainer.removeChild(requestNameButton);
					if (sentButtonContainer.hasChildNodes()){
						for (var o = 0, p = sentButtonContainer.childNodes.length; o < p; o++) {
							sentButtonContainer.childNodes[o].textContent = "Request " + (o + 1);
						}
					}

					var text = document.createElement('p');
					text.textContent = "Request declined.";
					text.className = 'status';
					return mainRequestDiv.appendChild(text);

					});

				},false);

			})(requestName, request, declineButton, reqArr[i]._id)

			sentButtonContainer.appendChild(requestName);

		}

	}





xhttp.request('GET', mainUrl + '/myRequestsController', function(data){
	data = JSON.parse(data);
	console.log(data);
	incomingRequestArray(data.requestsRecieved, data.books);
	outgoingRequestArray(data.requestsSent, data.books);
})














})()