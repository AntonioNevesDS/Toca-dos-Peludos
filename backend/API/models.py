from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base 

class Pet(Base):
    __tablename__ = "pets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String, nullable=False)
    especie = Column(String)
    descricao = Column(Text)
    disponivel = Column(Boolean, default=True)

class Denuncia(Base):
    __tablename__ = "denuncias"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    descricao = Column(Text, nullable=False)
    localizacao = Column(Text, nullable=False)
    status = Column(String, default="Pendente")
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())