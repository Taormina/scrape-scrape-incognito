var cache = require('./cache.js');
var port = process.env.PORT || 5000, express = require("express"),
    app = express(), yql = require("yql"), fs = require("fs");
var nameList = [];
var thingsarentbroken = true;
var dummyData = {
    "symbol": "YHOO",
    "AverageDailyVolume": "18844300",
    "Change": "-0.32",
    "DaysLow": "35.31",
    "DaysHigh": "35.94",
    "YearLow": "17.76",
    "YearHigh": "35.89",
    "MarketCapitalization": "36.845B",
    "LastTradePriceOnly": "35.37",
    "DaysRange": "35.31 - 35.94",
    "Name": "Yahoo! Inc.",
    "Symbol": "YHOO",
    "Volume": "9429977",
    "StockExchange": "NasdaqNM"
   }

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
	cache.init(0,0);
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
  if(thingsarentbroken){
  getStockBySymbol(req.params['symbol'], "*", function(stock){  
//    console.log(stock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });}
  else
	datDummyData(res);
});

app.get("/api/stockbyname/:name", function(req, res){
  if(thingsarentbroken){
  var symbols = symbolsContainingName(req.params['name']);
  if (symbols.length == 0)
		symbols = ["null"]
	
	var func = getStocksBySymbol;
	if (symbols.length == 1)
			func = getStockBySymbol;

	func(symbols, "*", function(stock){  
    //console.log(stock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });}
  else
	datDummyData(res);
});

app.get("/api/stockbysymbol/:symbol/:field", function(req, res){
	if(thingsarentbroken){
	getStockBySymbol(req.params['symbol'], req.params['field'], function(stock) {
		//console.log(stock);
		res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });}
  else
	datDummyData(res);
});

app.get("/api/history/:symbol/:startDate/:endDate", function(req, res){
  if(thingsarentbroken){
  getStockHistory(req.params['symbol'], "*", req.params['startDate'], req.params['endDate'], function(stock){  
//    console.log(stock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });}
  else
	datDummyData(res);
});

app.get("/api/pricerange/:lowest/:highest", function(req, res){
	if(thingsarentbroken){
	var symbols = symbolsInRange(req.params['lowest'], req.params['highest']);
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify(symbols));
	res.end();
	}
	else
		datDummyData(res);
});

function getStockBySymbol(symbol, field, callback){
//  console.log(symbol);
	var value = cache.get(symbol);
	if (value == null) {
	  new yql.exec("select " + field + " from yahoo.finance.quote where (symbol = @symbol)", function(yqlResponse){
	  	if (yqlResponse.query.results != null) {
				cache.put(symbol, yqlResponse.query.results.quote);
  	  	callback(yqlResponse.query.results.quote);
			}
	  } , {"symbol": symbol})
	} else {
		callback(value);
	}
}

function getStocksBySymbol(symbols, field, callback){
	var quotes = [];
	var misses = [];
	//console.log(symbols);
	
	for (index = 0; index < symbols.length; ++index) {
		var value = cache.get(symbols[index]);
		if (value == null) {
			misses.push(symbols[index]);
		} else {
			quotes.push(value);
		}
	}

	//console.log(misses.join());
	if (misses.length > 0) {	
		new yql.exec("select " + field + " from yahoo.finance.quote where (symbol = @symbol)", function(yqlResponse){
  		if (yqlResponse.query.results != null) {
				//console.log(yqlResponse.query.count);
				var quote = yqlResponse.query.results.quote;
				quotes = quotes.concat(quote);
				for (index = 0; index < quote.length; ++index) {
					cache.put(quote[index].symbol, quote[index]);
				}
				callback(quotes);
			}
		} , {"symbol": misses.slice(0,200).join(",")})
	}	else {
		callback(quotes);
	}
}

function getStockHistory(symbol, field, startDate, endDate, callback){
//  console.log(symbol);
	new yql.exec("select " + field + " from yahoo.finance.historicaldata where (symbol = @symbol) and (startDate = @startDate) and (endDate = @endDate)", function(yqlResponse){
 	if (yqlResponse.query.results != null) 
		callback(yqlResponse.query.results.quote);
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

function symbolsInRange(lowest, highest){
	return cache.range(lowest*1.0, highest*1.0);
}

function datDummyData(res){
	res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(dummyData));
    res.end();
}

init();
app.listen(port);
console.log("App started...");

if (thingsarentbroken) {
	var symbols = symbolsContainingName(".*");
	var numFinished = 0;
	for (var i = 0; i <= symbols.length; i+=200) {
		getStocksBySymbol(symbols.slice(i,i+200), "*", function(stock) {
			if (++numFinished > symbols.length/200) {
				console.log("Cache loaded...");
			}
	});}
}

