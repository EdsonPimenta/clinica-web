package com.clinica;

import com.clinica.model.ProfissionalSaude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TESTES DE INTEGRACAO
 * Usa @SpringBootTest para carregar todo o contexto da aplicacao.
 * Testa a integracao real entre Controller -> Repository -> Banco.
 * No CI, roda com PostgreSQL real via container; localmente, com H2.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class IntegracaoTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void deveExecutarFluxoCompletoProfissional() throws Exception {
        // 1. INSERIR profissional (Medico = categoria 3)
        ProfissionalSaude p = new ProfissionalSaude();
        p.setNome("Dra. Maria Santos");
        p.setTelefone("31988887777");
        p.setEndereco("Av. Brasil, 200");
        p.setCategoria(3);

        MvcResult result = mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Dra. Maria Santos"))
                .andReturn();

        Long id = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("id").asLong();

        // 2. CONSULTAR (id)
        mockMvc.perform(get("/api/profissionais/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoria").value(3));

        // 3. CONSULTAR (categoria)
        mockMvc.perform(get("/api/profissionais/categoria/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // 4. ALTERAR (id)
        p.setNome("Dra. Maria Santos Silva");
        p.setCategoria(1); // muda para Psicologo
        mockMvc.perform(put("/api/profissionais/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Dra. Maria Santos Silva"))
                .andExpect(jsonPath("$.categoria").value(1));

        // 5. EXCLUIR (id)
        mockMvc.perform(delete("/api/profissionais/" + id))
                .andExpect(status().isOk());
    }

    @Test
    void deveVincularAtendimentoEExameAoProfissional() throws Exception {
        // Cria profissional (Fisioterapeuta = categoria 2)
        ProfissionalSaude p = new ProfissionalSaude();
        p.setNome("Dr. Pedro Lima");
        p.setTelefone("31977776666");
        p.setCategoria(2);

        MvcResult profResult = mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isCreated())
                .andReturn();

        Long profId = objectMapper.readTree(
                profResult.getResponse().getContentAsString()).get("id").asLong();

        // Cria atendimento vinculado ao profissional
        String atendJson = String.format("""
            {
                "data": "2026-06-20",
                "horario": "14:30",
                "problema": "Dor no joelho",
                "receita": "Exercicios de fortalecimento",
                "profissional": {"id": %d}
            }
            """, profId);

        MvcResult atendResult = mockMvc.perform(post("/api/atendimentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(atendJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.problema").value("Dor no joelho"))
                .andReturn();

        Long atendId = objectMapper.readTree(
                atendResult.getResponse().getContentAsString()).get("id").asLong();

        // Cria exame de laboratorio vinculado ao atendimento
        String exameJson = String.format("""
            {
                "descricao": "Raio-X do joelho",
                "resultado": "Sem fraturas",
                "data": "2026-06-21",
                "atendimento": {"id": %d}
            }
            """, atendId);

        mockMvc.perform(post("/api/exames")
                .contentType(MediaType.APPLICATION_JSON)
                .content(exameJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.descricao").value("Raio-X do joelho"));

        // Consulta exames do atendimento
        mockMvc.perform(get("/api/exames/atendimento/" + atendId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].descricao").value("Raio-X do joelho"));
    }
}
