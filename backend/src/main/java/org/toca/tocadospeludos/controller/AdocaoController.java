package org.toca.tocadospeludos.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toca.tocadospeludos.domain.SolicitacaoAdocao;
import org.toca.tocadospeludos.service.SolicitacaoService;

@RestController
@RequestMapping("/api/v1/adocoes")
public class AdocaoController {
    private final SolicitacaoService solicitacaoService;

    public AdocaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<SolicitacaoAdocao> criar(@RequestParam Long pet_id, @Valid @RequestBody SolicitacaoAdocao body) {
        return ResponseEntity.ok(solicitacaoService.criar(pet_id, body));
    }
}
