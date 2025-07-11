package com.pcfale.inventario.services;

import com.azure.cosmos.*;
import com.azure.cosmos.models.*;
import com.azure.cosmos.util.CosmosPagedIterable;
import com.pcfale.inventario.models.Produto;
import com.pcfale.inventario.models.Categoria; // <- IMPORTANTE

import java.util.ArrayList;
import java.util.List;

public class CosmosDbService {
    private final CosmosClient client;
    private final CosmosContainer containerProdutos;

    public CosmosDbService() {
        String endpoint = System.getenv("COSMOS_DB_ENDPOINT");
        String key = System.getenv("COSMOS_DB_KEY");

        this.client = new CosmosClientBuilder()
                .endpoint(endpoint)
                .key(key)
                .consistencyLevel(ConsistencyLevel.EVENTUAL)
                .buildClient();

        CosmosDatabase database = client.getDatabase("InventarioDB");
        this.containerProdutos = database.getContainer("Produtos");
    }

    // Produtos
    public Produto addProduto(Produto produto) {
        containerProdutos.createItem(produto);
        return produto;
    }

    public List<Produto> listarProdutos() {
        String sql = "SELECT * FROM c";
        CosmosPagedIterable<Produto> results = containerProdutos.queryItems(sql, new CosmosQueryRequestOptions(), Produto.class);

        List<Produto> lista = new ArrayList<>();
        results.forEach(lista::add);
        return lista;
    }

    public Produto atualizarProduto(Produto produto) {
        containerProdutos.upsertItem(produto);
        return produto;
    }

    public void removerProduto(String id, String partitionKey) {
        containerProdutos.deleteItem(id, new PartitionKey(partitionKey), new CosmosItemRequestOptions());
    }

    // Categorias
    public Categoria addCategoria(Categoria categoria) {
        CosmosContainer containerCategorias = client.getDatabase("InventarioDB").getContainer("Categorias");
        containerCategorias.createItem(categoria);
        return categoria;
    }

    public List<Categoria> listarCategorias() {
        CosmosContainer containerCategorias = client.getDatabase("InventarioDB").getContainer("Categorias");
        String sql = "SELECT * FROM c";
        CosmosPagedIterable<Categoria> results = containerCategorias.queryItems(sql, new CosmosQueryRequestOptions(), Categoria.class);

        List<Categoria> lista = new ArrayList<>();
        results.forEach(lista::add);
        return lista;
    }
}
