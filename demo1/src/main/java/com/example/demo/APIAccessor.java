package com.example.demo;

import java.awt.image.BufferedImage;
import java.io.*;
import java.util.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


//https://api.twelvedata.com/time_series?&start_date=2020-01-06&end_date=2020-05-06&symbol=aapl&interval=1day&apikey=xxx
@Service
public class APIAccessor {

    @Value("${api.key}")
    private String apiKey;

    public String infoLoader(ArrayList<String> ticker, String startDate, String endDate, StockHashTable centralTable) throws IOException {
        // API key is already injected

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request;
        String URL;
        HttpResponse<String> response;

        if (ticker.size() < 2) {
            URL = "https://api.twelvedata.com/time_series?&start_date=" + startDate + "&end_date=" + endDate + "&symbol=" + ticker.get(0) + "&interval=1day&apikey=" + apiKey;
            request = HttpRequest.newBuilder().uri(URI.create(URL)).build();
            try {
                response = client.send(request, HttpResponse.BodyHandlers.ofString());
                return parseJsonResponse(response.body(), centralTable, ticker);
            } catch (Exception e) {
                return "Error: " + e.getMessage();
            }
        } else {
            // Handle multiple tickers as before
            StringBuilder temp = new StringBuilder();
            for (String symbol : ticker) {
                temp.append(symbol).append(",");
            }
            URL = "https://api.twelvedata.com/time_series?&start_date=" + startDate + "&end_date=" + endDate + "&symbol=" + temp + "&interval=1day&apikey=" + apiKey;
            request = HttpRequest.newBuilder().uri(URI.create(URL)).build();
            try {
                response = client.send(request, HttpResponse.BodyHandlers.ofString());
                return parseJsonResponse(response.body(), centralTable, ticker);
            } catch (Exception e) {
                return "Error: " + e.getMessage();
            }
        }
    }

    private String parseJsonResponse(String responseBody, StockHashTable centralTable, ArrayList<String> tickers) {
        JSONObject json = new JSONObject(responseBody);
        StringBuilder result = new StringBuilder();

        // Case 1: Single symbol response
        if (json.has("meta")) {
            parseSymbol(json, centralTable, result);
        } else {
            // Case 2: Multiple symbols in the response
            Set<String> keys = json.keySet();
            for (String key : keys) {
                if (json.getJSONObject(key).has("meta")) {
                    parseSymbol(json.getJSONObject(key), centralTable, result);
                }
            }
        }
        return result.toString();
    }




    // Helper method to parse information from JSON for a specific symbol
    private void parseSymbol(JSONObject json, StockHashTable centralTable, StringBuilder result) {
        String symbol = json.getJSONObject("meta").getString("symbol");
        JSONArray values = json.getJSONArray("values");

        for (int i = 0; i < values.length(); i++) {
            JSONObject data = values.getJSONObject(i);
            String date = data.getString("datetime");
            String key = purify(date, symbol);

            if (centralTable.get(key) != null) {
                result.append("Saved time at: ").append(date).append("\n");
                result.append(centralTable.printOne(key)).append("\n");
                continue;
            }

            // If HT doesn't have the info already, load it in.
            double open = data.getDouble("open");
            double high = data.getDouble("high");
            double low = data.getDouble("low");
            double close = data.getDouble("close");
            long volume = data.getLong("volume");

            String value = String.format("Symbol: %s\nDate: %s\nOpen: %.2f\nHigh: %.2f\nLow: %.2f\nClose: %.2f\nVolume: %d\n",
                    symbol, date, open, high, low, close, volume);
            result.append(value).append("\n");
            centralTable.put(key, value);
        }
    }
    // Method to generate a unique key for storing data in centralTable
    public static String purify(String date, String ticker) {
        date = date.replaceAll("-", "");
        int intDate = Integer.parseInt(date);
        int tickerHash = 0;
        for (char ch : ticker.toCharArray()) {
            tickerHash += (int) ch;
        }
        return String.valueOf(intDate + tickerHash);
    }
}