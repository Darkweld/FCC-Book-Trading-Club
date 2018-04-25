var React = require("react");
var ReactDOM = require("react-dom");



class BookOverlay extends React.Component {
	render() {
		let author = (this.props.author) ? <p className = "bookAuthor">{this.props.author}</p> : null
		
		return(
		<div className = "tooltip">
			<p className = "bookTitle">{this.props.title}</p>
				{author}
			<p className = "bookUser">{this.props.user}</p>
		</div>
		);
	}
}


class Book extends React.Component {
	render() {
		
		return(
		<div className = "bookDiv" onClick = {e => this.props.click(e, this.props.userName)}>
			<img className = "bookImage" src = {this.props.imgSRC}></img>
			<BookOverlay title = {this.props.title} author = {this.props.author} user = {this.props.userName} />
		</div>
		);
	}
}

class Main extends React.Component {
	constructor() {
		super();
		
		this.state = {bookData: []};
		this.handleBookClick = this.handleBookClick.bind(this);
	}
	
	componentDidMount() {
		fetch("https://peaceful-forest-57401.herokuapp.com/bookListIndex")
		.then(response => response.json())
		.then(data => this.setState({bookData: data}));
	}
	
	handleBookClick (e, val) {	
		window.location.href = "https://peaceful-forest-57401.herokuapp.com/request/" + val;	
	}
	
	
	render() {
		
		let bookArray = this.state.bookData.map(b => <Book key = {b._id} click = {this.handleBookClick} imgSRC = {b.image} title = {b.title} author = {b.authors}
		userName = {b.user.localUsername} />);
		
	return (
	<div className = "mainContainer">
		<h1 className = "title"> "FreeCodeCamp book club by "<a className = "userLink" href = "https://github.com/Darkweld">Darkweld</a></h1>
		<p className = "boldText">"Click a book to request a book from a user."</p>
			<div className = "book-container">
			{bookArray}
			</div>
	</div>
	);	
	}
	
}



ReactDOM.render(<Main />, document.getElementById("root"));
