package org.toca.tocadospeludos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toca.tocadospeludos.domain.*;
import org.toca.tocadospeludos.service.PetService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pets")
public class PetController {
    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public ResponseEntity<List<Pet>> listar(
            @RequestParam(required = false) Especie especie,
            @RequestParam(required = false) Porte porte,
            @RequestParam(required = false) Sexo sexo
    ) {
        return ResponseEntity.ok(petService.listar(especie, porte, sexo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> buscar(@PathVariable Long id) {
        return petService.buscar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
