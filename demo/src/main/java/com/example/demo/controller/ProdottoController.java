package com.example.demo.controller;

import com.example.demo.model.Prodotto;
import com.example.demo.service.ProdottoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prodotti")
public class ProdottoController {

    private final ProdottoService prodottoService;

    @Autowired
    public ProdottoController(ProdottoService prodottoService) {
        this.prodottoService = prodottoService;
    }

    // CREATE (POST /api/prodotti)
    @PostMapping
    public ResponseEntity<Prodotto> creaProdotto(@RequestBody Prodotto prodotto) {
        Prodotto nuovoProdotto = prodottoService.salvaProdotto(prodotto);
        return new ResponseEntity<>(nuovoProdotto, HttpStatus.CREATED); // HTTP 201
    }

    // READ All (GET /api/prodotti)
    @GetMapping
    public List<Prodotto> getAllProdotti() {
        return prodottoService.trovaTuttiIProdotti();
    }

    // READ By Id (GET /api/prodotti/{id})
    @GetMapping("/{id}")
    public ResponseEntity<Prodotto> getProdottoById(@PathVariable Long id) {
        return prodottoService.trovaProdottoPerId(id)
                .map(prodotto -> new ResponseEntity<>(prodotto, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // UPDATE (PUT /api/prodotti/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Prodotto> updateProdotto(@PathVariable Long id, @RequestBody Prodotto prodottoDetails) {
        return prodottoService.trovaProdottoPerId(id)
            .map(prodotto -> {
                prodotto.setNome(prodottoDetails.getNome());
                prodotto.setPrezzo(prodottoDetails.getPrezzo());
                Prodotto updatedProdotto = prodottoService.salvaProdotto(prodotto);
                return new ResponseEntity<>(updatedProdotto, HttpStatus.OK);
            })
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // DELETE (DELETE /api/prodotti/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProdotto(@PathVariable Long id) {
        if (prodottoService.trovaProdottoPerId(id).isPresent()) {
            prodottoService.eliminaProdotto(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // HTTP 204
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // HTTP 404
        }
    }
}