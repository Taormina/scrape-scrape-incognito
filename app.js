var port, express, app;


//Initializations
port = process.env.PORT || 5000;
express = require("express");
app = new express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
	


// Homepage
app.get('/', function(req, res){	
	res.render('home');	
});


app.listen(port);
