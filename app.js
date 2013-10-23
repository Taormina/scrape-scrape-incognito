var port = process.env.PORT || 5000, express = require("express"),
    app = express(), yql = require("yql"), fs = require("fs");
var nameList = [];

app.set("view engine", "ejs");
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/views'));

function init(){
  var symbols = fs.readFileSync("symbols.txt","utf8");
  symbols = symbols.split("\n");
  for(line in symbols){
    if (symbols.hasOwnProperty(line) && symbols[line]) {
      var pair = symbols[line].split("\t");
      pair[1] = pair[1].slice(0,pair[1].length-2);
      nameList.push([pair[1],pair[0]]);
    }
  }
}


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

app.get("/api/stockbysymbol/:symbol", function(req, res){
  getStockBySymbol(req.params['symbol'], "*", function(stock){  
//    console.log(stock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });
});

app.get("/api/stockbyname/:name", function(req, res){
  var symbols = symbolsContainingName(req.params['name']).join();
  getStockBySymbol(symbols, "*", function(stock){  
//    console.log(stock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });
});

app.get("/api/stockbysymbol/:symbol/:field", function(req, res){
	getStockBySymbol(req.params['symbol'], req.params['field'], function(stock) {
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

function getStockBySymbol(symbol, field, callback){
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

function symbolsContainingName(str){
  var regex = new RegExp(str, "i", "g");
  var results = [];
  for(pair in nameList){
    if(nameList.hasOwnProperty(pair)){
      if(regex.test(nameList[pair][0])){
          results.push(nameList[pair][1]);
        }
    }
  }
  return results;
}

init();
app.listen(port);
console.log("App started...");
