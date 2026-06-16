package com.clinica.controller;

import com.clinica.model.ProfissionalSaude;
import com.clinica.repository.ProfissionalSaudeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * CRUD de Profissionais de Saude.
 * Operacoes do diagrama: Inserir, Alterar(id), Consultar(Nome),
 * Consultar(id), Consultar(categoria), Excluir(id).
 */
@RestController
@RequestMapping("/api/profissionais")
@CrossOrigin(origins = "*")
public class ProfissionalSaudeController {

    private final ProfissionalSaudeRepository repository;

    public ProfissionalSaudeController(ProfissionalSaudeRepository repository) {
        this.repository = repository;
    }

    // INSERIR - Criar novo profissional
    @PostMapping
    public ResponseEntity<ProfissionalSaude> criar(@Valid @RequestBody ProfissionalSaude profissional) {
        ProfissionalSaude salvo = repository.save(profissional);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // CONSULTAR - Listar todos
    @GetMapping
    public ResponseEntity<List<ProfissionalSaude>> listar() {
        return ResponseEntity.ok(repository.findAllByOrderByNomeAsc());
    }

    // CONSULTAR (id)
    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // CONSULTAR (Nome) -> /api/profissionais/buscar?nome=...
    @GetMapping("/buscar")
    public ResponseEntity<List<ProfissionalSaude>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(repository.findByNomeContainingIgnoreCase(nome));
    }

    // CONSULTAR (categoria) -> /api/profissionais/categoria/{categoria}
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ProfissionalSaude>> buscarPorCategoria(@PathVariable Integer categoria) {
        return ResponseEntity.ok(repository.findByCategoriaOrderByNomeAsc(categoria));
    }

    // ALTERAR (id)
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody ProfissionalSaude dados) {
        return repository.findById(id)
                .map(p -> {
                    p.setNome(dados.getNome());
                    p.setTelefone(dados.getTelefone());
                    p.setEndereco(dados.getEndereco());
                    p.setCategoria(dados.getCategoria());
                    return ResponseEntity.ok(repository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // EXCLUIR (id)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(p -> {
                    repository.delete(p);
                    return ResponseEntity.ok(Map.of("mensagem", "Profissional removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
