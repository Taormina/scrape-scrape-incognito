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
  getStockData(req.body["symbol"], function(stock){
    var prettyString = JSON.stringify(stock, undefined, '\t');
//    console.log(prettyString);
    res.render("test_stock_result", {result : stock, pretty : prettyString});
  });
});

app.get("/api/stock/:symbol", function(req,res){
  getStockData(req.params['symbol'], function(stock){  
//    console.log(stock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(stock));
    res.end();
  });
});


function getStockData(symbol, callback){
//  console.log(symbol);
  new yql.exec("select * from yahoo.finance.quote where (symbol = @symbol)", function(yqlResponse){
    callback(yqlResponse.query.results.quote);
  }
, {"symbol": symbol})
}

app.listen(port);
