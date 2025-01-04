package com.example.demo.Controller;

import com.example.demo.APIAccessor;
import com.example.demo.StockHashTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;

@RestController
@RequestMapping("/")
public class StockController {

    private final APIAccessor apiAccessor;
    private final StockHashTable centralTable;

    // Constructor-based dependency injection
    @Autowired
    public StockController(APIAccessor apiAccessor, StockHashTable centralTable) {
        this.apiAccessor = apiAccessor;
        this.centralTable = centralTable;
    }

    @PostMapping("/stock-data")
    public String getStockData(@RequestParam String stockName, @RequestParam String startDate, @RequestParam String endDate) throws IOException {
        // Create a list with the stock name (or handle multiple stock symbols)
        ArrayList<String> ticker = new ArrayList<>();
        ticker.add(stockName);

        // Call the APIAccessor to fetch data
        String result = apiAccessor.infoLoader(ticker, startDate, endDate, centralTable);
        String[] test = result.split("Symbol");
        String temp;
        temp = "<html><head><title>Stock Data</title></head><body>";
        temp += "<table border='1'><tr><th>Stock Info</th></tr>";
        for(String s : test) {
            temp += "<tr><td>" + s + "</td></tr>";
        }
        temp += "</table>";
        temp += "</body></html>";
        System.out.println(temp);
        return temp;
    }
}
