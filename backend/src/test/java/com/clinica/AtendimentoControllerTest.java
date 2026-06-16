package com.clinica;

import com.clinica.controller.AtendimentoController;
import com.clinica.model.Atendimento;
import com.clinica.repository.AtendimentoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TESTES UNITARIOS - Atendimentos
 * Usa @WebMvcTest para testar apenas o controller isoladamente.
 */
@WebMvcTest(AtendimentoController.class)
class AtendimentoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AtendimentoRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    private final ObjectMapper json = new ObjectMapper().registerModule(new JavaTimeModule());

    @Test
    void deveCriarAtendimentoComSucesso() throws Exception {
        Atendimento a = new Atendimento();
        a.setId(1L);
        a.setData(LocalDate.of(2026, 6, 20));
        a.setProblema("Dor lombar");
        a.setReceita("Sessoes de fisioterapia 2x/semana");

        when(repository.save(any(Atendimento.class))).thenReturn(a);

        mockMvc.perform(post("/api/atendimentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(a)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.problema").value("Dor lombar"));
    }

    @Test
    void deveListarAtendimentosVazio() throws Exception {
        when(repository.findAllByOrderByDataAscHorarioAsc()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/atendimentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void deveRetornar404ParaAtendimentoInexistente() throws Exception {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/atendimentos/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveDeletarAtendimentoComSucesso() throws Exception {
        Atendimento a = new Atendimento();
        a.setId(1L);
        a.setData(LocalDate.of(2026, 6, 20));

        when(repository.findById(1L)).thenReturn(Optional.of(a));

        mockMvc.perform(delete("/api/atendimentos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensagem").value("Atendimento removido com sucesso"));
    }
}
