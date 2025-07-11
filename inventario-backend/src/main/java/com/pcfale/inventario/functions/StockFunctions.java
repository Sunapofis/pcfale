package com.pcfale.inventario.functions;

import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import com.pcfale.inventario.models.Stock;
import com.pcfale.inventario.services.StockService;

import java.util.*;

public class StockFunctions {

    private final StockService stockService = new StockService();

    @FunctionName("getStock")
    public HttpResponseMessage getStock(
            @HttpTrigger(name = "req", methods = {HttpMethod.GET}, route = "stock", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) {

        context.getLogger().info("GET /stock chamada");

        List<Stock> stocks = stockService.listarStocks();

        return request.createResponseBuilder(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(stocks)
                .build();
    }

    @FunctionName("addStock")
    public HttpResponseMessage addStock(
            @HttpTrigger(name = "req", methods = {HttpMethod.POST}, route = "stock", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<Stock>> request,
            final ExecutionContext context) {

        context.getLogger().info("POST /stock chamada");

        Optional<Stock> stockOpt = request.getBody();

        if (!stockOpt.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Dados do stock não fornecidos.")
                    .build();
        }

        Stock stock = stockOpt.get();
        stock.setId(UUID.randomUUID().toString());

        stockService.addStock(stock);

        return request.createResponseBuilder(HttpStatus.CREATED)
                .header("Content-Type", "application/json")
                .body(stock)
                .build();
    }

    @FunctionName("updateStock")
    public HttpResponseMessage updateStock(
            @HttpTrigger(name = "req", methods = {HttpMethod.PUT}, route = "stock/{id}", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<Stock>> request,
            @BindingName("id") String id,
            final ExecutionContext context) {

        context.getLogger().info("PUT /stock/" + id + " chamada");

        Optional<Stock> stockOpt = request.getBody();

        if (!stockOpt.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Dados do stock não fornecidos.")
                    .build();
        }

        Stock stock = stockOpt.get();
        stock.setId(id);

        stockService.atualizarStock(stock);

        return request.createResponseBuilder(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(stock)
                .build();
    }

    @FunctionName("deleteStock")
    public HttpResponseMessage deleteStock(
            @HttpTrigger(name = "req", methods = {HttpMethod.DELETE}, route = "stock/{id}/{partitionKey}", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            @BindingName("id") String id,
            @BindingName("partitionKey") String partitionKey,
            final ExecutionContext context) {

        context.getLogger().info("DELETE /stock/" + id + " chamada");

        try {
            stockService.removerStock(id, partitionKey);
            return request.createResponseBuilder(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao remover stock: " + e.getMessage())
                    .build();
        }
    }
}
