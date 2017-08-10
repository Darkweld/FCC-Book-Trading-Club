'use strict';

(function(){

	var mainRequestDiv = document.getElementById('myRequestDiv');
	var buttonContainer = document.getElementById('buttonContainer');

	function makeBookDivs(array) {

		if (!array.length) {
        	var nothingText = document.createElement('p');
        	nothingText.textContent = "Absolutely nothing!";
        	nothingText.className = "nothingText";
        	return nothingText;
        }

        var bookfragment = document.createDocumentFragment();
            
        for (var i = 0, l = array.length; i < l; i++) {

            var bookDiv = document.createElement('div');
            bookDiv.className = "myRequestBookDiv";
            
            var bookImage = document.createElement('img');
            bookImage.src = array[i].image;
            bookImage.className = 'myRequestBookImage';
            bookDiv.appendChild(bookImage);

            var tooltip = document.createElement('span');
            tooltip.className = 'myRequestTooltip';
            
            var bookTitle = document.createElement('p');
            bookTitle.textContent = array[i].title;
            bookTitle.className = "bookTitle";
            tooltip.appendChild(bookTitle);
            
            if (array[i].authors)
            
            for (var j = 0, k = array[i].authors.length; j < k; j++) {
                var bookAuthor = document.createElement('p');
                bookAuthor.textContent = array[i].authors[j];
                bookAuthor.className = "bookAuthor";
                tooltip.appendChild(bookAuthor);
            }

            bookDiv.appendChild(tooltip);
            
            bookfragment.appendChild(bookDiv);

        }

        return bookfragment;
	}



	function requestArray(reqArr){

		if (!reqArr.length){
			var norequestText = document.createElement('p');
			norequestText.textContent = "You currently do not have any requests.";
			return mainRequestDiv.appendChild(norequestText);
		}

		var fragment = new DocumentFragment();

		for (var i = 0, l = reqArr.length; i < l; i++){

			var request = document.createElement('div');
			request.className = "request";

			var recieverDivHolder = document.createElement('div');
			recieverDivHolder.className = 'recieverDivHolder';
			var recieverDivHolderText = document.createElement('p');
			recieverDivHolderText.textContent = "insert username here";

			var recieverDiv = document.createElement('div');
			recieverDiv.className = 'recieverDiv';
			recieverDiv.appendChild(makeBookDivs(reqArr[i].booksRequested));

			recieverDivHolder.appendChild(recieverDivHolderText);
			recieverDivHolder.appendChild(recieverDiv);
			request.appendChild(recieverDivHolder);

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

			var requesterDivHolder = document.createElement('div');
			requesterDivHolder.className = 'requesterDivHolder';
			var requesterDivHolderText = document.createElement('p');
			requesterDivHolderText.textContent = "insert username here 2";

			var requesterDiv = document.createElement('div');
			requesterDiv.className = 'requesterDiv';
			requesterDiv.appendChild(makeBookDivs(reqArr[i].booksOffered));

			requesterDivHolder.appendChild(requesterDiv);
			requesterDivHolder.appendChild(requesterDivHolderText);
			request.appendChild(requesterDivHolder);

			var requestName = document.createElement('button');
			requestName.textContent = "Request Number " + (i + 1);
			requestName.className = 'requestNameButton';

			(function(requestNameButton, requestDiv, accept, decline, id) {

				requestNameButton.addEventListener('click', function(event){
					while (mainRequestDiv.hasChildNodes()){
						mainRequestDiv.removeChild(mainRequestDiv.firstChild);
					}

					 mainRequestDiv.appendChild(requestDiv);
				},false);

				accept.addEventListener('click', function(event){
					xhttp.request('POST', mainUrl + '/acceptRequest/' + id, function(data){

						while (mainRequestDiv.hasChildNodes()){
						mainRequestDiv.removeChild(mainRequestDiv.firstChild);
					}

					buttonContainer.removeChild(requestNameButton);
					if (buttonContainer.hasChildNodes()){
						for (var o = 0, p = buttonContainer.childNodes.length; o < p; o++) {
							buttonContainer.childNodes[o].textContent = "Request Number " + (o + 1);
						}
					}

					var text = document.createElement('p');
					text.textContent = "request accepted.";
					return mainRequestDiv.appendChild(text);

					});
				},false);

				decline.addEventListener('click', function(event){

					xhttp.request('POST', mainUrl + '/deleteRequest/' + id, function(data){

						while (mainRequestDiv.hasChildNodes()){
						mainRequestDiv.removeChild(mainRequestDiv.firstChild);
					}

					buttonContainer.removeChild(requestNameButton);
					if (buttonContainer.hasChildNodes()){
						for (var o = 0, p = buttonContainer.childNodes.length; o < p; o++) {
							buttonContainer.childNodes[o].textContent = "Request Number " + (o + 1);
						}
					}

					var text = document.createElement('p');
					text.textContent = "request declined.";
					return mainRequestDiv.appendChild(text);

					});

				},false);

			})(requestName, request, acceptButton, declineButton, reqArr[i]._id)

			buttonContainer.appendChild(requestName);

		}

	}





xhttp.request('GET', mainUrl + '/myRequestsController', function(data){
	data = JSON.parse(data);
	console.log(data);
	requestArray(data.requests);
})














})()