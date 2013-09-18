      /**
       * @jsx React.DOM
       */       
      // Your code here
      // tutorial1.js
		var CommentBox = React.createClass({
		  render: function() {
			return (
			  <div class="commentBox">
				Hello, world! I am a CommentBox.
			  </div>
			);
		  }
		});
		React.renderComponent(
		  <CommentBox />,
		  document.getElementById('content')
		);





//~ /** @jsx React.DOM */
//~ var navbar = React.createClass({
	//~ render: function() {
		//~ return (
		  //~ <div class="navbar navbar-inverse navbar-fixed-top">
		  //~ <div class="navbar-inner">
			//~ <div class="container">
			  //~ <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				//~ <span class="icon-bar"></span>
				//~ <span class="icon-bar"></span>
				//~ <span class="icon-bar"></span>
			  //~ </button>
			  //~ <a class="brand" href="/">Stock Scraper</a>
			  //~ <div class="nav-collapse collapse">
				//~ <ul class="nav">
				  //~ <li><a href="/">Home</a></li>
				//~ </ul>
			  //~ </div><!--/.nav-collapse -->
			//~ </div>
		  //~ </div>
		//~ </div>	
		//~ );
	//~ }
//~ });


//~ var header = React.createClass({
	//~ render: function() {
		//~ return (
			//~ <meta charset="utf-8">
			//~ <title>Recipe Nation</title>
			//~ <meta name="viewport" content="width=device-width, initial-scale=1.0">
			//~ <meta name="description" content="">
			//~ <meta name="author" content="">
			//~ <!-- Le styles -->
			//~ <link href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
			//~ <script src="http://code.jquery.com/jquery.js"></script>
			//~ <script src="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
			//~ <link href="../assets/css/bootstrap-responsive.css" rel="stylesheet">
		//~ );
	//~ }	
//~ });
//~ 
//~ var footer = React.createClass({
	//~ render: function(){
		//~ return(			
			//~ <!-- Placed at the end of the document so the pages load faster -->
			//~ <script src="http://code.jquery.com/jquery.js"></script>
			//~ <script src="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
		//~ );
	//~ }	
//~ });

//~ React.renderComponent(
  //~ <navbar/>,
  //~ document.getElementById('navbar')  
//~ );
//React.renderComponent(
  //<header/>,
  //document.header
//);
//React.renderComponent(
  //<footer/>,
  //document.getElementById('footer')
//);
