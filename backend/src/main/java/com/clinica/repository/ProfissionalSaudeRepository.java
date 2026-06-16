package com.clinica.repository;

import com.clinica.model.ProfissionalSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProfissionalSaudeRepository extends JpaRepository<ProfissionalSaude, Long> {

    // Consultar (ordenado por nome)
    List<ProfissionalSaude> findAllByOrderByNomeAsc();

    // Consultar (Nome)
    List<ProfissionalSaude> findByNomeContainingIgnoreCase(String nome);

    // Consultar (categoria)
    List<ProfissionalSaude> findByCategoriaOrderByNomeAsc(Integer categoria);
}
