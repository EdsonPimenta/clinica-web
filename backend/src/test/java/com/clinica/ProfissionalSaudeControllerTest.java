package com.clinica;

import com.clinica.controller.ProfissionalSaudeController;
import com.clinica.model.ProfissionalSaude;
import com.clinica.repository.ProfissionalSaudeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TESTES UNITARIOS - Profissionais de Saude
 * Usa @WebMvcTest para testar apenas o controller isoladamente.
 * O repository e mockado com @MockBean.
 */
@WebMvcTest(ProfissionalSaudeController.class)
class ProfissionalSaudeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProfissionalSaudeRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void deveCriarProfissionalComSucesso() throws Exception {
        ProfissionalSaude p = new ProfissionalSaude();
        p.setId(1L);
        p.setNome("Dra. Ana Souza");
        p.setTelefone("31999999999");
        p.setEndereco("Rua A, 100");
        p.setCategoria(3); // Medico

        when(repository.save(any(ProfissionalSaude.class))).thenReturn(p);

        mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Dra. Ana Souza"))
                .andExpect(jsonPath("$.categoria").value(3));
    }

    @Test
    void deveListarProfissionaisVazio() throws Exception {
        when(repository.findAllByOrderByNomeAsc()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/profissionais"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void deveBuscarProfissionaisPorCategoria() throws Exception {
        ProfissionalSaude p = new ProfissionalSaude();
        p.setId(2L);
        p.setNome("Dr. Bruno Lima");
        p.setCategoria(2); // Fisioterapeuta

        when(repository.findByCategoriaOrderByNomeAsc(2)).thenReturn(Arrays.asList(p));

        mockMvc.perform(get("/api/profissionais/categoria/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Dr. Bruno Lima"))
                .andExpect(jsonPath("$[0].categoria").value(2));
    }

    @Test
    void deveRetornar404ParaProfissionalInexistente() throws Exception {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/profissionais/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveDeletarProfissionalComSucesso() throws Exception {
        ProfissionalSaude p = new ProfissionalSaude();
        p.setId(1L);
        p.setNome("Dra. Ana Souza");
        p.setCategoria(1);

        when(repository.findById(1L)).thenReturn(Optional.of(p));

        mockMvc.perform(delete("/api/profissionais/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensagem").value("Profissional removido com sucesso"));
    }
}
