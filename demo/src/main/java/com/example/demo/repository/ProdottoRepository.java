package com.example.demo.repository;

import com.example.demo.model.Prodotto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Opzionale, ma buona pratica per chiarezza
// Estendendo JpaRepository, ottieni automaticamente i metodi CRUD:
// save(), findById(), findAll(), deleteById(), ecc.
public interface ProdottoRepository extends JpaRepository<Prodotto, Long> {
    // Non serve scrivere codice qui!
}
