CREATE EXTENSION IF NO EXISTS "uudid-ossp";

--Tabela de usuários para o login
CREATE TABLE funcionarios (
    id UUDID PRIMARY  KEY DEFAULT  uudid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--tabela  pets
CREATE TABLE pets (
    id UUDID PRIMARY  KEY DEFAULT  uudid_generate_v4(),
    nome VARCHAR(50) NOT NULL,
    especie VARCHAR(100) NOT NULL,
    raca VARCHAR(100) NOT NULL,
    idade INT,
    descricao TEXT,
    imagem_url TEXT,
    disponivel_para_adocao BOOLEAN DEFAULT TRUE,
    data_resgate DATE
);

--tabela denuncias
CREATE TABLE denuncias (
   id UUDID PRIMARY  KEY DEFAULT  uudid_generate_v4(),
   titulo VARCHAR(100) NOT NULL,
   descricao TEXT NOT NULL,
   localizacao TEXT NOT NULL,
   status VARCHAR(20) DEFAULT 'pendente',
   data_anuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   usuario_id UUDID REFERENCES usuario(id)
    
)