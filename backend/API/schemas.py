from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DenunciaCreate(BaseModel):
      titulo: Optional[str] = None
      descricao: str
      localixacao: str

class Denuncia(DenunciaCreate):
      id: int
      status: str
      data_denuncia: datetime

class config:
      from_attributes = True


      