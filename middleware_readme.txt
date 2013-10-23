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

get("/api/stock/:symbol"):
Input the desired stock symbol (MSFT, SALE).

get("/api/stock/:symbol/:field"):
Input the symbol and field you want ("AverageDailyVolume", "Change", "YearLow").

get("/api/history/:symbol/:startDate/:endDate"):
Input the symbol and the date range you're looking for.
