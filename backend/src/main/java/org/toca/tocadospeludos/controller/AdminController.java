package org.toca.tocadospeludos.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toca.tocadospeludos.domain.Pet;
import org.toca.tocadospeludos.domain.SolicitacaoAdocao;
import org.toca.tocadospeludos.service.PetService;
import org.toca.tocadospeludos.service.SolicitacaoService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final PetService petService;
    private final SolicitacaoService solicitacaoService;

    public AdminController(PetService petService, SolicitacaoService solicitacaoService) {
        this.petService = petService;
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping("/pets")
    public ResponseEntity<Pet> criarPet(@Valid @RequestBody Pet pet) {
        return ResponseEntity.ok(petService.criar(pet));
    }

    @PutMapping("/pets/{id}")
    public ResponseEntity<Pet> atualizarPet(@PathVariable Long id, @Valid @RequestBody Pet pet) {
        return ResponseEntity.ok(petService.atualizar(id, pet));
    }

    @GetMapping("/solicitacoes")
    public ResponseEntity<List<SolicitacaoAdocao>> listarSolicitacoes() {
        return ResponseEntity.ok(solicitacaoService.listarTodas());
    }
}
