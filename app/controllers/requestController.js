'use strict';

(function(reciever, requester) {
var mainDiv = document.getElementById('mainRequestDiv');


function createRequestDiv(array, username){

			var fragment = new DocumentFragment();

	        for (var i = 0, l = array.length; i < l; i++) {

            var bookDiv = document.createElement('div');
            bookDiv.className = "bookDiv";
            bookDiv.id = array[i]._id;
            bookDiv.draggable = true;
            
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
            
            if (array[i].authors)
            
            for (var j = 0, k = array[i].authors.length; j < k; j++) {
                var bookAuthor = document.createElement('p');
                bookAuthor.textContent = array[i].authors[j];
                bookAuthor.className = "bookAuthor";
                tooltip.appendChild(bookAuthor);
            }

            var bookUser = document.createElement('p');
            bookUser.textContent = 'owned by: ' + username;
            bookUser.className = "bookUser";
            tooltip.appendChild(bookUser);
            bookDiv.appendChild(tooltip);
            
            fragment.appendChild(bookDiv);

        }
        return fragment;


    }


    function makeDivs(){
    	while(mainDiv.hasChildNodes()) {
    		mainDiv.removeChild(mainDiv.lastChild);
    	}

    var recieverClone = createRequestDiv(reciever.books, reciever.localUsername).cloneNode(true);
	var requesterClone = createRequestDiv(requester.books, requester.localUsername).cloneNode(true);
	var fragment = new DocumentFragment();

	var recieveTitle = document.createElement('p');
    recieveTitle.textContent = reciever.localUsername + "'s books";
    recieveTitle.className = "requestTitle";
    fragment.appendChild(recieveTitle);

	var recieverDiv = document.createElement('div');
	recieverDiv.className = 'requestee';
	fragment.appendChild(recieverDiv);

	var recieverDragDiv = document.createElement('div');
	recieverDragDiv.className = 'requesteeDrag';
	fragment.appendChild(recieverDragDiv);

	var form = document.createElement('form');
	form.action = '';
	form.id = 'Form';
	var inputButton = document.createElement('input');
	inputButton.type = "submit";
	inputButton.value = "submit trade!";
	form.appendChild(inputButton);
	fragment.appendChild(form);

	var requesterDragDiv = document.createElement('div');
	requesterDragDiv.className = 'requesterDrag';
	fragment.appendChild(requesterDragDiv);

	var requesterDiv = document.createElement('div');
	requesterDiv.className = 'requester';
	fragment.appendChild(requesterDiv);

	var requestTitle = document.createElement('p');
    requestTitle.textContent = requester.localUsername + "'s books";
    requestTitle.className = "requestTitle";
    fragment.appendChild(requestTitle);


	recieverDiv.appendChild(recieverClone.cloneNode(true));

	var recieverDivChildren = recieverDiv.childNodes;

	for (var i = 0, l = recieverDivChildren.length; i < l; i++) {
		(function(div){
                div.addEventListener('click', function(event) {
                   	if (div.parentNode === recieverDiv) {
                   		return recieverDragDiv.appendChild(div);
                   	}
                   	return recieverDiv.appendChild(div);
               }, false);
		})(recieverDivChildren[i])
	}

	requesterDiv.appendChild(requesterClone.cloneNode(true));

	var requesterDivChildren = requesterDiv.childNodes;

	for (var i = 0, l = requesterDivChildren.length; i < l; i++) {
		(function(div){
                div.addEventListener('click', function(event) {
                   	if (div.parentNode === requesterDiv) {
                   		return requesterDragDiv.appendChild(div);
                   	}
                   	return requesterDiv.appendChild(div);
               }, false);
		})(requesterDivChildren[i])
	}

	form.addEventListener('submit', function(event) {
		event.preventDefault();

		function childnodes (parent) {
			var arr = [];
			for (var i = 0, l = parent.length; i < l; i++) {
				arr[i] = parent[i].id;
			}
			return arr;
		};



		var url = mainUrl + '/makeRequest?' + 'recID=' + reciever._id + '&recBooks=' + childnodes(recieverDragDiv.childNodes)
			+ '&reqID=' + requester._id + '&reqBooks=' + childnodes(requesterDragDiv.childNodes);

		xhttp.request('POST', url, function(data){
			console.log(data);
		})

	}, false);
	mainDiv.appendChild(fragment);
    };







document.addEventListener('DOMContentLoaded', function(event){
	return makeDivs();
}, false);







})(reciever, requester);