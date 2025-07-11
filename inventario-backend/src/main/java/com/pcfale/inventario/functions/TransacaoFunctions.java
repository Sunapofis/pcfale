package com.pcfale.inventario.functions;

import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import com.pcfale.inventario.models.Transacao;
import com.pcfale.inventario.services.TransacaoService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class TransacaoFunctions {

    private final TransacaoService transacaoService = new TransacaoService();

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @FunctionName("getTransacoes")
    public HttpResponseMessage getTransacoes(
            @HttpTrigger(name = "req", methods = {HttpMethod.GET}, route = "transacoes", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) {

        context.getLogger().info("GET /transacoes chamada");

        List<Transacao> transacoes = transacaoService.listarTransacoes();

        return request.createResponseBuilder(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(transacoes)
                .build();
    }

    @FunctionName("addTransacao")
    public HttpResponseMessage addTransacao(
            @HttpTrigger(name = "req", methods = {HttpMethod.POST}, route = "transacoes", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<Transacao>> request,
            final ExecutionContext context) {

        context.getLogger().info("POST /transacoes chamada");

        Optional<Transacao> transacaoOpt = request.getBody();

        if (!transacaoOpt.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Dados da transação não fornecidos.")
                    .build();
        }

        Transacao transacao = transacaoOpt.get();
        transacao.setId(UUID.randomUUID().toString());
        transacao.setData(LocalDateTime.now().format(formatter)); // Gera data atual como string

        transacaoService.addTransacao(transacao);

        return request.createResponseBuilder(HttpStatus.CREATED)
                .header("Content-Type", "application/json")
                .body(transacao)
                .build();
    }

    @FunctionName("updateTransacao")
    public HttpResponseMessage updateTransacao(
            @HttpTrigger(name = "req", methods = {HttpMethod.PUT}, route = "transacoes/{id}", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<Transacao>> request,
            @BindingName("id") String id,
            final ExecutionContext context) {

        context.getLogger().info("PUT /transacoes/" + id + " chamada");

        Optional<Transacao> transacaoOpt = request.getBody();

        if (!transacaoOpt.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Dados da transação não fornecidos.")
                    .build();
        }

        Transacao transacao = transacaoOpt.get();
        transacao.setId(id);

        transacaoService.atualizarTransacao(transacao);

        return request.createResponseBuilder(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(transacao)
                .build();
    }

    @FunctionName("deleteTransacao")
    public HttpResponseMessage deleteTransacao(
            @HttpTrigger(name = "req", methods = {HttpMethod.DELETE}, route = "transacoes/{id}/{partitionKey}", authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            @BindingName("id") String id,
            @BindingName("partitionKey") String partitionKey,
            final ExecutionContext context) {

        context.getLogger().info("DELETE /transacoes/" + id + " chamada");

        try {
            transacaoService.removerTransacao(id, partitionKey);
            return request.createResponseBuilder(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao remover transação: " + e.getMessage())
                    .build();
        }
    }
}
