package com.pcfale.inventario.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Stock {
    @JsonProperty("id")
    private String id;  // chave primaria

    @JsonProperty("produtoId")
    private String produtoId;  // chave de partição, relaciona stock ao produto

    @JsonProperty("quantidade")
    private int quantidade;

    @JsonProperty("localizacao")
    private String localizacao;  // ex: "Armazém 1", "Loja Principal"

    public Stock() {
    }

    public Stock(String id, String produtoId, int quantidade, String localizacao) {
        this.id = id;
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.localizacao = localizacao;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(String produtoId) {
        this.produtoId = produtoId;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}
