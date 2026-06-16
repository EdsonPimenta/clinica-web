package com.clinica.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

/**
 * Atendimento realizado por um Profissional de Saude.
 * N atendimentos para 1 profissional (relacao do diagrama).
 * "receita" representa a Receita/Saude: remedio (medico),
 * atividade fisica (fisioterapeuta) ou atividades mentais (psicologo).
 */
@Entity
@Table(name = "atendimentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Atendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Data e obrigatoria")
    private LocalDate data;

    private LocalTime horario;

    @Column(columnDefinition = "TEXT")
    private String problema;

    @Column(columnDefinition = "TEXT")
    private String receita;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profissional_id")
    private ProfissionalSaude profissional;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
}
