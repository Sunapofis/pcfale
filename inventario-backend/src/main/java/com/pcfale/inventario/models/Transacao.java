package com.pcfale.inventario.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Transacao {
    @JsonProperty("id")
    private String id;

    @JsonProperty("produtoId")
    private String produtoId;

    @JsonProperty("tipo")
    private String tipo;

    @JsonProperty("quantidade")
    private int quantidade;

    @JsonProperty("data")
    private String data;

    @JsonProperty("descricao")
    private String descricao;

    public Transacao() {}

    public Transacao(String id, String produtoId, String tipo, int quantidade, String data, String descricao) {
        this.id = id;
        this.produtoId = produtoId;
        this.tipo = tipo;
        this.quantidade = quantidade;
        this.data = data;
        this.descricao = descricao;
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

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
