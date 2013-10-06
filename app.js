var port = process.env.PORT || 5000, express = require("express"),
    app = express(), yql = require("yql");

app.set("view engine", "ejs");
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/views'));



// Homepage
app.get("/", function(req, res){	
  res.render("home");	
});

app.get("/test/stock", function(req, res){
  res.render("test_stock");
});

app.post("/test/stock",function(req,res){
  getStockData(req.body["symbol"], "*",  function(stock){
    var prettyString = JSON.stringify(stock, undefined, '\t');
//    console.log(prettyString);
    res.render("test_stock_result", {result : stock, pretty : prettyString});
  });
});

app.get("/api/stock/:symbol", function(req, res){
  getStockData(req.params['symbol'], "*", function(stock){  
//    console.log(stock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });
});

app.get("/api/stock/:symbol/:field", function(req, res){
	getStockData(req.params['symbol'], req.params['field'], function(stock) {
		console.log(stock);
		res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });
});

app.get("/api/history/:symbol/:startDate/:endDate", function(req, res){
  getStockHistory(req.params['symbol'], "*", req.params['startDate'], req.params['endDate'], function(stock){  
//    console.log(stock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });
});

function getStockData(symbol, field, callback){
//  console.log(symbol);
  new yql.exec("select " + field + " from yahoo.finance.quote where (symbol = @symbol)", function(yqlResponse){
  	if (yqlResponse.query.results != null)
			callback(yqlResponse.query.results.quote);
  }
, {"symbol": symbol})
}

function getStockHistory(symbol, field, startDate, endDate, callback){
//  console.log(symbol);
  new yql.exec("select " + field + " from yahoo.finance.historicaldata where (symbol = @symbol) and (startDate = @startDate) and (endDate = @endDate)", function(yqlResponse){
  	if (yqlResponse.query.results != null)
			callback(yqlResponse.query.results);
  }
, {"symbol": symbol, "startDate": startDate, "endDate": endDate})
}

app.listen(port);
console.log("App started...");
