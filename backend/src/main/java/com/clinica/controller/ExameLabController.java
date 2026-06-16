package com.clinica.controller;

import com.clinica.model.ExameLab;
import com.clinica.repository.ExameLabRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exames")
@CrossOrigin(origins = "*")
public class ExameLabController {

    private final ExameLabRepository repository;

    public ExameLabController(ExameLabRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<ExameLab> criar(@Valid @RequestBody ExameLab exame) {
        ExameLab salvo = repository.save(exame);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<ExameLab>> listar() {
        return ResponseEntity.ok(repository.findAllByOrderByDataDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Consultar exames de um atendimento
    @GetMapping("/atendimento/{atendimentoId}")
    public ResponseEntity<List<ExameLab>> porAtendimento(@PathVariable Long atendimentoId) {
        return ResponseEntity.ok(repository.findByAtendimentoId(atendimentoId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody ExameLab dados) {
        return repository.findById(id)
                .map(e -> {
                    e.setDescricao(dados.getDescricao());
                    e.setResultado(dados.getResultado());
                    e.setData(dados.getData());
                    e.setAtendimento(dados.getAtendimento());
                    return ResponseEntity.ok(repository.save(e));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(e -> {
                    repository.delete(e);
                    return ResponseEntity.ok(Map.of("mensagem", "Exame removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
