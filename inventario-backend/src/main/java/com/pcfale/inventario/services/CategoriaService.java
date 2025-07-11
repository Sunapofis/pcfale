package com.pcfale.inventario.services;

import com.azure.cosmos.*;
import com.azure.cosmos.models.*;
import com.azure.cosmos.util.CosmosPagedIterable;
import com.pcfale.inventario.models.Categoria;

import java.util.ArrayList;
import java.util.List;

public class CategoriaService {
    private final CosmosContainer container;

    public CategoriaService() {
        String endpoint = System.getenv("COSMOS_DB_ENDPOINT");
        String key = System.getenv("COSMOS_DB_KEY");

        CosmosClient client = new CosmosClientBuilder()
                .endpoint(endpoint)
                .key(key)
                .consistencyLevel(ConsistencyLevel.EVENTUAL)
                .buildClient();

        CosmosDatabase database = client.getDatabase("InventarioDB");
        this.container = database.getContainer("Categorias");
    }

    public Categoria addCategoria(Categoria categoria) {
        container.createItem(categoria);
        return categoria;
    }

    public List<Categoria> listarCategorias() {
        String sql = "SELECT * FROM c";  // <- CORRIGIDO AQUI
        CosmosPagedIterable<Categoria> results = container.queryItems(sql, new CosmosQueryRequestOptions(), Categoria.class);

        List<Categoria> lista = new ArrayList<>();
        results.forEach(lista::add);
        return lista;
    }

    public void removerCategoria(String id, String partitionKey) {
        container.deleteItem(id, new PartitionKey(partitionKey), new CosmosItemRequestOptions());
    }

}
