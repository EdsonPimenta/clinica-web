package com.clinica.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Profissional de Saude (Requisito Obrigatorio do diagrama).
 * categoria: 1 = Psicologo, 2 = Fisioterapeuta, 3 = Medico
 */
@Entity
@Table(name = "profissionais_saude")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfissionalSaude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome e obrigatorio")
    @Column(length = 100, nullable = false)
    private String nome;

    @Column(length = 20)
    private String telefone;

    @Column(length = 200)
    private String endereco;

    @NotNull(message = "Categoria e obrigatoria")
    @Min(value = 1, message = "Categoria deve ser 1 (Psicologo), 2 (Fisioterapeuta) ou 3 (Medico)")
    @Max(value = 3, message = "Categoria deve ser 1 (Psicologo), 2 (Fisioterapeuta) ou 3 (Medico)")
    @Column(nullable = false)
    private Integer categoria;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
}
