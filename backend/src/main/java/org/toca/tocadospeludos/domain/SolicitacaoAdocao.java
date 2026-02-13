package org.toca.tocadospeludos.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

@Entity
@Table(name = "solicitacoes_adocao")
public class SolicitacaoAdocao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @NotBlank
    @Size(max = 150)
    private String nomeInteressado;

    @Email
    @NotBlank
    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String whatsapp;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    private Instant dataSolicitacao = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }
    public String getNomeInteressado() { return nomeInteressado; }
    public void setNomeInteressado(String nomeInteressado) { this.nomeInteressado = nomeInteressado; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    public Instant getDataSolicitacao() { return dataSolicitacao; }
    public void setDataSolicitacao(Instant dataSolicitacao) { this.dataSolicitacao = dataSolicitacao; }
}
