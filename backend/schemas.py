from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class ConfiguracionBase(BaseModel):
    nombre_finca: str
    propietario: str
    ubicacion: str
    moneda: str

class ConfiguracionUpdate(ConfiguracionBase):
    pass

class Configuracion(ConfiguracionBase):
    id: int
    class Config:
        from_attributes = True

class LoteBase(BaseModel):
    nombre: str
    cultivo: str
    estado: str
    hectareas: float

class LoteCreate(LoteBase):
    pass

class Lote(LoteBase):
    id: int
    class Config:
        from_attributes = True

class ProductoBase(BaseModel):
    nombre: str
    unidad: str

class ProductoCreate(ProductoBase):
    pass

class Producto(ProductoBase):
    id: int
    class Config:
        from_attributes = True

class IngresoBase(BaseModel):
    fecha: date
    lote_id: int
    producto_id: int
    cantidad: float
    precio_unitario: float
    total: float
    cultivo: Optional[str] = None

class IngresoCreate(IngresoBase):
    pass

class Ingreso(IngresoBase):
    id: int
    class Config:
        from_attributes = True

class CategoriaEgresoBase(BaseModel):
    nombre: str
    tipo_defecto: str
    clasificacion_contable: str = "Costo de Producción"

class CategoriaEgresoCreate(CategoriaEgresoBase):
    pass

class CategoriaEgreso(CategoriaEgresoBase):
    id: int
    class Config:
        from_attributes = True

class EgresoBase(BaseModel):
    fecha: date
    lote_id: Optional[int] = None
    producto_id: Optional[int] = None
    categoria: str
    descripcion: str
    valor: float
    tipo: str
    cultivo: Optional[str] = None

class EgresoCreate(EgresoBase):
    pass

class Egreso(EgresoBase):
    id: int
    class Config:
        from_attributes = True

class PyGConsolidado(BaseModel):
    ingresos_operacionales: float
    costos_produccion: float
    utilidad_bruta: float
    gastos_administrativos: float
    gastos_ventas: float
    utilidad_operacional: float
    gastos_financieros: float
    utilidad_neta: float

class DashboardStats(BaseModel):
    total_ingresos: float
    total_egresos: float
    utilidad_neta: float
    margen_ganancia: float
    pyg_consolidado: PyGConsolidado
    flujo_caja_mensual: List[dict]
    costos_por_categoria: List[dict]
    costos_por_tipo: List[dict]
    rentabilidad_lotes: List[dict]
    rentabilidad_productos: List[dict]
