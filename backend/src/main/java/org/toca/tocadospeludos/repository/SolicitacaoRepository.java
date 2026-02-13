package org.toca.tocadospeludos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.toca.tocadospeludos.domain.SolicitacaoAdocao;

public interface SolicitacaoRepository extends JpaRepository<SolicitacaoAdocao, Long> {
}
