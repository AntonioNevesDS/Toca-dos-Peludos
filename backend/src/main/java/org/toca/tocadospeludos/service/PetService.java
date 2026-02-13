package org.toca.tocadospeludos.service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.toca.tocadospeludos.domain.*;
import org.toca.tocadospeludos.repository.PetRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {
    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<Pet> listar(Especie especie, Porte porte, Sexo sexo) {
        Specification<Pet> spec = Specification.where(null);
        if (especie != null) spec = spec.and((root, q, cb) -> cb.equal(root.get("especie"), especie));
        if (porte != null) spec = spec.and((root, q, cb) -> cb.equal(root.get("porte"), porte));
        if (sexo != null) spec = spec.and((root, q, cb) -> cb.equal(root.get("sexo"), sexo));
        return petRepository.findAll(spec);
    }

    public Optional<Pet> buscar(Long id) {
        return petRepository.findById(id);
    }

    public Pet criar(Pet pet) {
        return petRepository.save(pet);
    }

    public Pet atualizar(Long id, Pet atualizacao) {
        return petRepository.findById(id).map(existing -> {
            existing.setNome(atualizacao.getNome());
            existing.setEspecie(atualizacao.getEspecie());
            existing.setPorte(atualizacao.getPorte());
            existing.setSexo(atualizacao.getSexo());
            existing.setIdadeEstimada(atualizacao.getIdadeEstimada());
            existing.setDescricao(atualizacao.getDescricao());
            existing.setStatus(atualizacao.getStatus());
            existing.setUrlFoto(atualizacao.getUrlFoto());
            return petRepository.save(existing);
        }).orElseThrow(() -> new IllegalArgumentException("Pet não encontrado"));
    }
}
