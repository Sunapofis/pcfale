package com.pcfale.inventario.services;

import com.azure.cosmos.*;
import com.azure.cosmos.models.*;
import com.azure.cosmos.util.CosmosPagedIterable;
import com.pcfale.inventario.models.Stock;

import java.util.ArrayList;
import java.util.List;

public class StockService {
    private final CosmosContainer container;

    public StockService() {
        String endpoint = System.getenv("COSMOS_DB_ENDPOINT");
        String key = System.getenv("COSMOS_DB_KEY");

        CosmosClient client = new CosmosClientBuilder()
                .endpoint(endpoint)
                .key(key)
                .consistencyLevel(ConsistencyLevel.EVENTUAL)
                .buildClient();

        CosmosDatabase database = client.getDatabase("InventarioDB");
        this.container = database.getContainer("Stock");
    }

    public Stock addStock(Stock stock) {
        container.createItem(stock);
        return stock;
    }

    public List<Stock> listarStocks() {
        String sql = "SELECT * FROM c";
        CosmosPagedIterable<Stock> results = container.queryItems(sql, new CosmosQueryRequestOptions(), Stock.class);

        List<Stock> lista = new ArrayList<>();
        results.forEach(lista::add);
        return lista;
    }

    public Stock atualizarStock(Stock stock) {
        container.upsertItem(stock);
        return stock;
    }

    public void removerStock(String id, String partitionKey) {
        container.deleteItem(id, new PartitionKey(partitionKey), new CosmosItemRequestOptions());
    }

    public Stock obterStockPorId(String id, String partitionKey) {
        return container.readItem(id, new PartitionKey(partitionKey), Stock.class).getItem();
    }
}
