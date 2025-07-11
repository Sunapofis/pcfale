package com.pcfale.inventario.functions;

import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import java.util.*;
import com.pcfale.inventario.models.Produto;
import com.pcfale.inventario.services.CosmosDbService;

public class ProdutoFunctions {

    @FunctionName("getProdutos")
    public HttpResponseMessage getProdutos(
            @HttpTrigger(name = "req", methods = {HttpMethod.GET}, route = "produtos", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) {

        context.getLogger().info("Requisição GET para listar produtos recebida.");

        try {
            CosmosDbService dbService = new CosmosDbService();
            List<Produto> produtos = dbService.listarProdutos();

            return request.createResponseBuilder(HttpStatus.OK)
                    .header("Content-Type", "application/json")
                    .body(produtos)
                    .build();

        } catch (Exception e) {
            context.getLogger().severe("Erro ao obter produtos do CosmosDB: " + e.getMessage());
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao listar produtos.")
                    .build();
        }
    }

    @FunctionName("addProduto")
    public HttpResponseMessage addProduto(
            @HttpTrigger(
                    name = "req",
                    methods = {HttpMethod.POST},
                    route = "produtos",
                    authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<Produto>> request,
            final ExecutionContext context) {

        context.getLogger().info("Requisição POST para adicionar produto recebida.");

        Optional<Produto> produtoOpt = request.getBody();

        if (!produtoOpt.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Dados do produto não fornecidos.")
                    .build();
        }

        Produto produto = produtoOpt.get();

        // Gera ID e código do produto
        produto.setId(UUID.randomUUID().toString());
        produto.setCodigoProduto("PROD" + new Random().nextInt(10000));

        try {
            CosmosDbService dbService = new CosmosDbService();
            dbService.addProduto(produto);

            return request.createResponseBuilder(HttpStatus.CREATED)
                    .header("Content-Type", "application/json")
                    .body(produto)
                    .build();

        } catch (Exception e) {
            context.getLogger().severe("Erro ao gravar no CosmosDB: " + e.getMessage());
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao guardar produto no CosmosDB.")
                    .build();
        }
    }


    @FunctionName("updateProduto")
    public HttpResponseMessage updateProduto(
            @HttpTrigger(
                    name = "req",
                    methods = {HttpMethod.PUT},
                    route = "produtos/{id}",
                    authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<Produto>> request,
            @BindingName("id") String id,
            final ExecutionContext context) {

        context.getLogger().info("Requisição PUT para atualizar produto com ID: " + id);

        Optional<Produto> produtoOpt = request.getBody();

        if (!produtoOpt.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Dados do produto não fornecidos.")
                    .build();
        }

        Produto atualizado = produtoOpt.get();
        atualizado.setId(id); // Mantém o ID

        try {
            CosmosDbService dbService = new CosmosDbService();
            dbService.atualizarProduto(atualizado);

            return request.createResponseBuilder(HttpStatus.OK)
                    .header("Content-Type", "application/json")
                    .body(atualizado)
                    .build();

        } catch (Exception e) {
            context.getLogger().severe("Erro ao atualizar produto: " + e.getMessage());
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar produto.")
                    .build();
        }
    }


    @FunctionName("deleteProduto")
    public HttpResponseMessage deleteProduto(
            @HttpTrigger(
                    name = "req",
                    methods = {HttpMethod.DELETE},
                    route = "produtos/{id}",
                    authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            @BindingName("id") String id,
            final ExecutionContext context) {

        context.getLogger().info("Requisição DELETE para remover produto com ID: " + id);

        try {
            CosmosDbService dbService = new CosmosDbService();
            dbService.removerProduto(id, id); // Supondo que partitionKey é o ID

            return request.createResponseBuilder(HttpStatus.NO_CONTENT).build();

        } catch (Exception e) {
            context.getLogger().severe("Erro ao apagar produto: " + e.getMessage());
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao apagar produto.")
                    .build();
        }
    }


}