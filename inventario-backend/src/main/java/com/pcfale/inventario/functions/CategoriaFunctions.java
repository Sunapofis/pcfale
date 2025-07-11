package com.pcfale.inventario.functions;

import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import com.pcfale.inventario.models.Categoria;
import com.pcfale.inventario.services.CategoriaService;

import java.util.*;

public class CategoriaFunctions {

    @FunctionName("getCategorias")
    public HttpResponseMessage getCategorias(
            @HttpTrigger(name = "req", methods = {HttpMethod.GET}, route = "categorias", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) {

        context.getLogger().info("Requisição GET para listar categorias recebida.");

        CategoriaService service = new CategoriaService();
        List<Categoria> categorias = service.listarCategorias();

        return request.createResponseBuilder(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(categorias)
                .build();
    }

    @FunctionName("atualizarCategoria")
    public HttpResponseMessage atualizarCategoria(
            @HttpTrigger(name = "req", methods = {HttpMethod.PUT}, route = "categorias/{id}", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<Categoria>> request,
            @BindingName("id") String id,
            final ExecutionContext context) {

        context.getLogger().info("Requisição PUT para atualizar categoria: " + id);

        Optional<Categoria> categoriaOpt = request.getBody();
        if (!categoriaOpt.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Dados da categoria não fornecidos.")
                    .build();
        }

        Categoria categoria = categoriaOpt.get();
        categoria.setId(id); // Garante que o ID é o mesmo da rota

        try {
            CategoriaService service = new CategoriaService();
            service.addCategoria(categoria); // `upsert`: cria ou atualiza

            return request.createResponseBuilder(HttpStatus.OK)
                    .body(categoria)
                    .build();

        } catch (Exception e) {
            context.getLogger().severe("Erro ao atualizar categoria: " + e.getMessage());
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar categoria.")
                    .build();
        }
    }


    @FunctionName("addCategoria")
    public HttpResponseMessage addCategoria(
            @HttpTrigger(name = "req", methods = {HttpMethod.POST}, route = "categorias", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<Categoria>> request,
            final ExecutionContext context) {

        context.getLogger().info("Requisição POST para adicionar categoria recebida.");

        Optional<Categoria> categoriaOpt = request.getBody();

        if (!categoriaOpt.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Dados da categoria não fornecidos.")
                    .build();
        }

        Categoria categoria = categoriaOpt.get();
        categoria.setId(UUID.randomUUID().toString());

        try {
            CategoriaService service = new CategoriaService();
            service.addCategoria(categoria);

            return request.createResponseBuilder(HttpStatus.CREATED)
                    .header("Content-Type", "application/json")
                    .body(categoria)
                    .build();

        } catch (Exception e) {
            context.getLogger().severe("Erro ao gravar categoria no CosmosDB: " + e.getMessage());
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao guardar categoria.")
                    .build();
        }
    }

    @FunctionName("removerCategoria")
    public HttpResponseMessage removerCategoria(
            @HttpTrigger(name = "req", methods = {HttpMethod.DELETE}, route = "categorias/{id}/{pk}", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            @BindingName("id") String id,
            @BindingName("pk") String partitionKey,
            final ExecutionContext context) {

        context.getLogger().info("Requisição DELETE para categoria: " + id);

        try {
            CategoriaService service = new CategoriaService();
            service.removerCategoria(id, partitionKey);

            return request.createResponseBuilder(HttpStatus.NO_CONTENT).build();

        } catch (Exception e) {
            context.getLogger().severe("Erro ao remover categoria: " + e.getMessage());
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao remover categoria.")
                    .build();
        }
    }

}
