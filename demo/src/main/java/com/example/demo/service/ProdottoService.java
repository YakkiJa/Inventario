package com.example.demo.service;

import com.example.demo.model.Prodotto;
import com.example.demo.repository.ProdottoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service // Marca la classe come Service (logica di business)
public class ProdottoService {

    private final ProdottoRepository prodottoRepository;

    @Autowired // Inietta l'istanza del Repository (Dependency Injection)
    public ProdottoService(ProdottoRepository prodottoRepository) {
        this.prodottoRepository = prodottoRepository;
    }

    // 1. CREATE e UPDATE (save() gestisce entrambi)
    public Prodotto salvaProdotto(Prodotto prodotto) {
        // Qui potresti aggiungere logica: validazione, calcolo tasse, ecc.
        return prodottoRepository.save(prodotto);
    }

    // 2. READ All
    public List<Prodotto> trovaTuttiIProdotti() {
        return prodottoRepository.findAll();
    }

    // 2. READ By Id
    public Optional<Prodotto> trovaProdottoPerId(Long id) {
        return prodottoRepository.findById(id);
    }

    // 3. DELETE
    public void eliminaProdotto(Long id) {
        prodottoRepository.deleteById(id);
    }
}
