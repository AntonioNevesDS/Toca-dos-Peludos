package org.toca.tocadospeludos.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

@Entity
@Table(name = "pets")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String nome;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Especie especie;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Porte porte;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Sexo sexo;

    private Integer idadeEstimada;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    private StatusPet status = StatusPet.DISPONIVEL;

    @Size(max = 255)
    private String urlFoto;

    private Instant dataCadastro = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Especie getEspecie() { return especie; }
    public void setEspecie(Especie especie) { this.especie = especie; }
    public Porte getPorte() { return porte; }
    public void setPorte(Porte porte) { this.porte = porte; }
    public Sexo getSexo() { return sexo; }
    public void setSexo(Sexo sexo) { this.sexo = sexo; }
    public Integer getIdadeEstimada() { return idadeEstimada; }
    public void setIdadeEstimada(Integer idadeEstimada) { this.idadeEstimada = idadeEstimada; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public StatusPet getStatus() { return status; }
    public void setStatus(StatusPet status) { this.status = status; }
    public String getUrlFoto() { return urlFoto; }
    public void setUrlFoto(String urlFoto) { this.urlFoto = urlFoto; }
    public Instant getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(Instant dataCadastro) { this.dataCadastro = dataCadastro; }
}
