from fastapi import FastAPI, HTTPException
from pydantic import BaseMoldel
from typing import Optional

# cria a instancia
app =  FastAPI()

class animal(BaseMoldel):
    raca: str
    tipo: str
    nome: str
    idade: int
    adotado: bool = False

@app.get("/")
def ler_raiz():
    return {"mensagem": "API está online e funcionando!"}

banco_de_dados = {}

#rota post para 
@app.post("/animal/{animal_id}")
  def criar_animal(animal_id: str, animal: animal):
   if animal_id in bancoDeDados:
     raise HTTPException(status_code= 400, detail="Animal já está cadstrado")
   
   banco_de_dados{animal_id} = animal
   return {"animal_id": animal_id, "dados": animal}

@app.get("animal/{animal_id}")
  def ler_animal(animal_id: int):
   if animal_id is not banco_de_dados:
     raise HTTPException(status_code=404, detail="Animal não encontrado" )
   
   return banco_de_dados[animal_id]

@app.get("/animal")
  def listar_animais():
   return banco_de_dados