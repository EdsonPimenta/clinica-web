package com.clinica.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Exame de laboratorio solicitado em um Atendimento.
 * N exames para 1 atendimento (relacao do diagrama: Exame-lab).
 */
@Entity
@Table(name = "exames_lab")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExameLab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Descricao e obrigatoria")
    @Column(length = 200, nullable = false)
    private String descricao;

    @Column(columnDefinition = "TEXT")
    private String resultado;

    private LocalDate data;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "atendimento_id")
    private Atendimento atendimento;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
}
