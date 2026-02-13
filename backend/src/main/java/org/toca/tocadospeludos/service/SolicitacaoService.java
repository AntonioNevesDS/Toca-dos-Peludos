package org.toca.tocadospeludos.service;

import org.springframework.stereotype.Service;
import org.toca.tocadospeludos.domain.Pet;
import org.toca.tocadospeludos.domain.SolicitacaoAdocao;
import org.toca.tocadospeludos.repository.PetRepository;
import org.toca.tocadospeludos.repository.SolicitacaoRepository;

import java.util.List;

@Service
public class SolicitacaoService {
    private final SolicitacaoRepository solicitacaoRepository;
    private final PetRepository petRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository, PetRepository petRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.petRepository = petRepository;
    }

    public SolicitacaoAdocao criar(Long petId, SolicitacaoAdocao solicitacao) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("Pet não encontrado"));
        solicitacao.setPet(pet);
        return solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoAdocao> listarTodas() {
        return solicitacaoRepository.findAll();
    }
}
