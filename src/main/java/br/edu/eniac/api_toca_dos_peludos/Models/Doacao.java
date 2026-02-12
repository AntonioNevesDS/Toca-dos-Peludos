package br.edu.eniac.api_toca_dos_peludos.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeDoador;
    private String emailDoador;
    private Double valor;
    private LocalDate dataDoacao;

    @PrePersist
    public void prePersist(){
        this.dataDoacao = LocalDate.now();
    }
}
