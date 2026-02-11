package br.edu.eniac.api_toca_dos_peludos;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pets")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    private String name;

    private String especie;
    private  String porte;
    private String status;

    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String descricao;



}
