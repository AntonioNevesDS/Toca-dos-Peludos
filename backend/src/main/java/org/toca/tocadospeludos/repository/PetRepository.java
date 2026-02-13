package org.toca.tocadospeludos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.toca.tocadospeludos.domain.Pet;
import org.toca.tocadospeludos.domain.Especie;
import org.toca.tocadospeludos.domain.Porte;
import org.toca.tocadospeludos.domain.Sexo;

import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long>, JpaSpecificationExecutor<Pet> {
    List<Pet> findByEspecieAndPorteAndSexo(Especie especie, Porte porte, Sexo sexo);
}
