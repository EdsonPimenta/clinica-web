package com.clinica.controller;

import com.clinica.model.Atendimento;
import com.clinica.repository.AtendimentoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "*")
public class AtendimentoController {

    private final AtendimentoRepository repository;

    public AtendimentoController(AtendimentoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Atendimento> criar(@Valid @RequestBody Atendimento atendimento) {
        Atendimento salvo = repository.save(atendimento);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Atendimento>> listar() {
        return ResponseEntity.ok(repository.findAllByOrderByDataAscHorarioAsc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Consultar atendimentos de um profissional
    @GetMapping("/profissional/{profissionalId}")
    public ResponseEntity<List<Atendimento>> porProfissional(@PathVariable Long profissionalId) {
        return ResponseEntity.ok(repository.findByProfissionalId(profissionalId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody Atendimento dados) {
        return repository.findById(id)
                .map(a -> {
                    a.setData(dados.getData());
                    a.setHorario(dados.getHorario());
                    a.setProblema(dados.getProblema());
                    a.setReceita(dados.getReceita());
                    a.setProfissional(dados.getProfissional());
                    return ResponseEntity.ok(repository.save(a));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(a -> {
                    repository.delete(a);
                    return ResponseEntity.ok(Map.of("mensagem", "Atendimento removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
