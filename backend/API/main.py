from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel


#Importações dos seus arquivos locais
import models, schemas
from database import engine, get_db

app = FastAPI(title="API Toca dos Peludos")
        
#Cria as tabelas no PostgreSQL
models.Base.metadata.create_all(bind=engine)

#SCHEMAS PARA PETS 
class PetCreate(BaseModel):
    nome: str
    especie: str
    idade: int
    descricao: str

#ROTAS DE DENÚNCIAS

@app.post("/denuncias/", response_model=schemas.Denuncia)
def criar_denuncia(denuncia: schemas.DenunciaCreate, db: Session = Depends(get_db)):
    nova_denuncia = models.Denuncia(
        descricao=denuncia.descricao,
        localizacao=denuncia.localizacao
    )
    db.add(nova_denuncia)
    db.commit()
    db.refresh(nova_denuncia)
    return nova_denuncia

@app.get("/denuncias/", response_model=List[schemas.Denuncia])
def listar_denuncias(db: Session = Depends(get_db)):
    return db.query(models.Denuncia).all()

#ROTAS DE PETS

@app.get("/")
def home():
    return {"message": "API Toca dos Peludos online"}

@app.post("/pets/", status_code=201)
def criar_pet(pet: PetCreate):
    return {"status": "Pet cadastrado", "dados": pet}