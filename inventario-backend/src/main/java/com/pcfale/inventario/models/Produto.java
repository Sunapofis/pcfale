package com.pcfale.inventario.models;

public class Produto {
    private String id;
    private String nome;
    private String categoriaId;
    private int stock;
    private String codigoProduto;

    public Produto() {}

    public Produto(String id, String nome, String categoriaId, int stock, String codigoProduto) {
        this.id = id;
        this.nome = nome;
        this.categoriaId = categoriaId;
        this.stock = stock;
        this.codigoProduto = codigoProduto;
    }

    // Getters e Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCategoriaId() {
        return categoriaId;
    }
    public void setCategoriaId(String categoriaId) {
        this.categoriaId = categoriaId;
    }

    public int getStock() {
        return stock;
    }
    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getCodigoProduto() {
        return codigoProduto;
    }
    public void setCodigoProduto(String codigoProduto) {
        this.codigoProduto = codigoProduto;
    }
}