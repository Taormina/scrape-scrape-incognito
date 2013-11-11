Documentation for Middleware
-------------------------------

HTTP GET requests
========================
Each GET request returns a JSON object containing the relevant information that looks like this:

{
    "symbol":"SALE",
    "AverageDailyVolume":"510778",
    "Change":"+0.364",
    "DaysLow":"33.24",
    "DaysHigh":"34.48",
    "YearLow":"26.12",
    "YearHigh":"33.65",
    "MarketCapitalization":"1.733B",
    "LastTradePriceOnly":"34.31",
    "DaysRange":"33.24 - 34.48",
    "Name":"RetailMeNot, Inc.",
    "Symbol":"SALE","Volume":"67754",
    "StockExchange":"NasdaqNM"
}

Possible GET requests:
----------------------

get("/api/stockbysymbol/:symbol"):
Input the desired stock symbol(s): "MSFT, SALE".

get("/api/stockbysymbol/:symbol/:field"):
Input the symbol and field you want: "AverageDailyVolume", "Change", "YearLow".

get("api/stockbyname/:name"):
Input the name (or part of the name) of the company.

get("/api/history/:symbol/:startDate/:endDate"):
Input the symbol and the date range you're looking for. Denote dates with "YYYY-MM-DD"

get("/api/pricerange/:lowest/:highest")
Input the lowest and highest stock price to search. 
NOTE: This does not actually return correct data... Right now this will just return the stock data for all stocks with "micro" in their company names
It's not the correct data, but it's in the correct format.
