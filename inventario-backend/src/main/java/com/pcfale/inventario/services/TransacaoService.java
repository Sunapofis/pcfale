package com.pcfale.inventario.services;

import com.azure.cosmos.*;
import com.azure.cosmos.models.*;
import com.azure.cosmos.util.CosmosPagedIterable;
import com.pcfale.inventario.models.Transacao;

import java.util.ArrayList;
import java.util.List;

public class TransacaoService {
    private final CosmosContainer container;

    public TransacaoService() {
        String endpoint = System.getenv("COSMOS_DB_ENDPOINT");
        String key = System.getenv("COSMOS_DB_KEY");

        CosmosClient client = new CosmosClientBuilder()
                .endpoint(endpoint)
                .key(key)
                .consistencyLevel(ConsistencyLevel.EVENTUAL)
                .buildClient();

        CosmosDatabase database = client.getDatabase("InventarioDB");
        this.container = database.getContainer("Transacoes");
    }

    public Transacao addTransacao(Transacao transacao) {
        container.createItem(transacao);
        return transacao;
    }

    public List<Transacao> listarTransacoes() {
        String sql = "SELECT * FROM c";
        CosmosPagedIterable<Transacao> results = container.queryItems(sql, new CosmosQueryRequestOptions(), Transacao.class);

        List<Transacao> lista = new ArrayList<>();
        results.forEach(lista::add);
        return lista;
    }

    public Transacao atualizarTransacao(Transacao transacao) {
        container.upsertItem(transacao);
        return transacao;
    }

    public void removerTransacao(String id, String partitionKey) {
        container.deleteItem(id, new PartitionKey(partitionKey), new CosmosItemRequestOptions());
    }

    public Transacao obterTransacaoPorId(String id, String partitionKey) {
        return container.readItem(id, new PartitionKey(partitionKey), Transacao.class).getItem();
    }
}
