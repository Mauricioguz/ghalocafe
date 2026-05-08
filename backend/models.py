from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Configuracion(Base):
    __tablename__ = "configuracion"
    id = Column(Integer, primary_key=True, index=True)
    nombre_finca = Column(String, default="La Leonora")
    propietario = Column(String, default="Administrador")
    ubicacion = Column(String, default="Vereda El Placer")
    moneda = Column(String, default="COP")

class Lote(Base):
    __tablename__ = "lotes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    cultivo = Column(String)
    estado = Column(String) # activo, produccion, descanso
    hectareas = Column(Float, default=0.0)

    ingresos = relationship("Ingreso", back_populates="lote")
    egresos = relationship("Egreso", back_populates="lote")

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    unidad = Column(String) # kg, arroba, bulto, etc.

    ingresos = relationship("Ingreso", back_populates="producto")

class Ingreso(Base):
    __tablename__ = "ingresos"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, default=datetime.date.today)
    lote_id = Column(Integer, ForeignKey("lotes.id"))
    producto_id = Column(Integer, ForeignKey("productos.id"))
    cantidad = Column(Float)
    precio_unitario = Column(Float)
    total = Column(Float)
    cultivo = Column(String, nullable=True)

    lote = relationship("Lote", back_populates="ingresos")
    producto = relationship("Producto", back_populates="ingresos")

class CategoriaEgreso(Base):
    __tablename__ = "categorias_egreso"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    tipo_defecto = Column(String, default="Fijo") # Fijo, Variable
    clasificacion_contable = Column(String, default="Costo de Producción") # Costo de Producción, Gasto Administrativo, Gasto de Ventas, Gasto Financiero

class Egreso(Base):
    __tablename__ = "egresos"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, default=datetime.date.today)
    lote_id = Column(Integer, ForeignKey("lotes.id"), nullable=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=True)
    categoria = Column(String) # mano de obra, fertilizantes, insumos, transporte, etc.
    descripcion = Column(String)
    valor = Column(Float)
    tipo = Column(String) # fijo, variable
    cultivo = Column(String, nullable=True)

    lote = relationship("Lote", back_populates="egresos")
    producto = relationship("Producto")
