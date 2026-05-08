from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import datetime
from sqlalchemy import func
import pandas as pd
from fastapi.responses import StreamingResponse
import io

import models, schemas, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="La Leonora - API de Gestión Agrícola")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURACION ---
@app.get("/configuracion", response_model=schemas.Configuracion)
def get_configuracion(db: Session = Depends(database.get_db)):
    config = db.query(models.Configuracion).first()
    if not config:
        config = models.Configuracion()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

@app.put("/configuracion", response_model=schemas.Configuracion)
def update_configuracion(config_in: schemas.ConfiguracionUpdate, db: Session = Depends(database.get_db)):
    config = db.query(models.Configuracion).first()
    if not config:
        config = models.Configuracion()
        db.add(config)
    for key, value in config_in.dict().items(): setattr(config, key, value)
    db.commit()
    db.refresh(config)
    return config

# --- CATEGORIAS EGRESO ---
@app.get("/categorias-egreso", response_model=List[schemas.CategoriaEgreso])
def get_categorias_egreso(db: Session = Depends(database.get_db)):
    cats = db.query(models.CategoriaEgreso).all()
    # Default categories if none exist
    if not cats:
        defaults = [
            models.CategoriaEgreso(nombre="Mano de obra", tipo_defecto="Variable", clasificacion_contable="Costo de Producción"),
            models.CategoriaEgreso(nombre="Fertilizantes", tipo_defecto="Variable", clasificacion_contable="Costo de Producción"),
            models.CategoriaEgreso(nombre="Insumos", tipo_defecto="Variable", clasificacion_contable="Costo de Producción"),
            models.CategoriaEgreso(nombre="Transporte", tipo_defecto="Variable", clasificacion_contable="Gasto de Ventas"),
            models.CategoriaEgreso(nombre="Administración", tipo_defecto="Fijo", clasificacion_contable="Gasto Administrativo"),
            models.CategoriaEgreso(nombre="Intereses Bancarios", tipo_defecto="Fijo", clasificacion_contable="Gasto Financiero"),
        ]
        db.add_all(defaults)
        db.commit()
        cats = db.query(models.CategoriaEgreso).all()
    return cats

@app.post("/categorias-egreso", response_model=schemas.CategoriaEgreso)
def create_categoria_egreso(cat: schemas.CategoriaEgresoCreate, db: Session = Depends(database.get_db)):
    db_cat = models.CategoriaEgreso(**cat.dict())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.put("/categorias-egreso/{cat_id}", response_model=schemas.CategoriaEgreso)
def update_categoria_egreso(cat_id: int, cat: schemas.CategoriaEgresoCreate, db: Session = Depends(database.get_db)):
    db_cat = db.query(models.CategoriaEgreso).filter(models.CategoriaEgreso.id == cat_id).first()
    if not db_cat: raise HTTPException(status_code=404, detail="Categoría no encontrada")
    for key, value in cat.dict().items(): setattr(db_cat, key, value)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.delete("/categorias-egreso/{cat_id}")
def delete_categoria_egreso(cat_id: int, db: Session = Depends(database.get_db)):
    db_cat = db.query(models.CategoriaEgreso).filter(models.CategoriaEgreso.id == cat_id).first()
    if not db_cat: raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(db_cat)
    db.commit()
    return {"ok": True}

# --- LOTES ---
@app.get("/lotes", response_model=List[schemas.Lote])
def get_lotes(db: Session = Depends(database.get_db)):
    return db.query(models.Lote).all()

@app.post("/lotes", response_model=schemas.Lote)
def create_lote(lote: schemas.LoteCreate, db: Session = Depends(database.get_db)):
    db_lote = models.Lote(**lote.dict())
    db.add(db_lote)
    db.commit()
    db.refresh(db_lote)
    return db_lote

@app.put("/lotes/{lote_id}", response_model=schemas.Lote)
def update_lote(lote_id: int, lote: schemas.LoteCreate, db: Session = Depends(database.get_db)):
    db_lote = db.query(models.Lote).filter(models.Lote.id == lote_id).first()
    if not db_lote: raise HTTPException(status_code=404, detail="Lote no encontrado")
    for key, value in lote.dict().items(): setattr(db_lote, key, value)
    db.commit()
    db.refresh(db_lote)
    return db_lote

@app.delete("/lotes/{lote_id}")
def delete_lote(lote_id: int, db: Session = Depends(database.get_db)):
    db_lote = db.query(models.Lote).filter(models.Lote.id == lote_id).first()
    if not db_lote: raise HTTPException(status_code=404, detail="Lote no encontrado")
    db.delete(db_lote)
    db.commit()
    return {"ok": True}

# --- PRODUCTOS ---
@app.get("/productos", response_model=List[schemas.Producto])
def get_productos(db: Session = Depends(database.get_db)):
    return db.query(models.Producto).all()

@app.post("/productos", response_model=schemas.Producto)
def create_producto(producto: schemas.ProductoCreate, db: Session = Depends(database.get_db)):
    db_prod = models.Producto(**producto.dict())
    db.add(db_prod)
    db.commit()
    db.refresh(db_prod)
    return db_prod

@app.put("/productos/{producto_id}", response_model=schemas.Producto)
def update_producto(producto_id: int, producto: schemas.ProductoCreate, db: Session = Depends(database.get_db)):
    db_prod = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not db_prod: raise HTTPException(status_code=404, detail="Producto no encontrado")
    for key, value in producto.dict().items(): setattr(db_prod, key, value)
    db.commit()
    db.refresh(db_prod)
    return db_prod

@app.delete("/productos/{producto_id}")
def delete_producto(producto_id: int, db: Session = Depends(database.get_db)):
    db_prod = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not db_prod: raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(db_prod)
    db.commit()
    return {"ok": True}

# --- INGRESOS ---
@app.get("/ingresos", response_model=List[schemas.Ingreso])
def get_ingresos(db: Session = Depends(database.get_db)):
    return db.query(models.Ingreso).all()

@app.post("/ingresos", response_model=schemas.Ingreso)
def create_ingreso(ingreso: schemas.IngresoCreate, db: Session = Depends(database.get_db)):
    db_ingreso = models.Ingreso(**ingreso.dict())
    db.add(db_ingreso)
    db.commit()
    db.refresh(db_ingreso)
    return db_ingreso

@app.put("/ingresos/{ingreso_id}", response_model=schemas.Ingreso)
def update_ingreso(ingreso_id: int, ingreso: schemas.IngresoCreate, db: Session = Depends(database.get_db)):
    db_ingreso = db.query(models.Ingreso).filter(models.Ingreso.id == ingreso_id).first()
    if not db_ingreso: raise HTTPException(status_code=404, detail="Ingreso no encontrado")
    for key, value in ingreso.dict().items(): setattr(db_ingreso, key, value)
    db.commit()
    db.refresh(db_ingreso)
    return db_ingreso

@app.delete("/ingresos/{ingreso_id}")
def delete_ingreso(ingreso_id: int, db: Session = Depends(database.get_db)):
    db_ingreso = db.query(models.Ingreso).filter(models.Ingreso.id == ingreso_id).first()
    if not db_ingreso: raise HTTPException(status_code=404, detail="Ingreso no encontrado")
    db.delete(db_ingreso)
    db.commit()
    return {"ok": True}

# --- EGRESOS ---
@app.get("/egresos", response_model=List[schemas.Egreso])
def get_egresos(db: Session = Depends(database.get_db)):
    return db.query(models.Egreso).all()

@app.post("/egresos", response_model=schemas.Egreso)
def create_egreso(egreso: schemas.EgresoCreate, db: Session = Depends(database.get_db)):
    db_egreso = models.Egreso(**egreso.dict())
    db.add(db_egreso)
    db.commit()
    db.refresh(db_egreso)
    return db_egreso

@app.put("/egresos/{egreso_id}", response_model=schemas.Egreso)
def update_egreso(egreso_id: int, egreso: schemas.EgresoCreate, db: Session = Depends(database.get_db)):
    db_egreso = db.query(models.Egreso).filter(models.Egreso.id == egreso_id).first()
    if not db_egreso: raise HTTPException(status_code=404, detail="Egreso no encontrado")
    for key, value in egreso.dict().items(): setattr(db_egreso, key, value)
    db.commit()
    db.refresh(db_egreso)
    return db_egreso

@app.delete("/egresos/{egreso_id}")
def delete_egreso(egreso_id: int, db: Session = Depends(database.get_db)):
    db_egreso = db.query(models.Egreso).filter(models.Egreso.id == egreso_id).first()
    if not db_egreso: raise HTTPException(status_code=404, detail="Egreso no encontrado")
    db.delete(db_egreso)
    db.commit()
    return {"ok": True}

# --- DASHBOARD STATS ---
@app.get("/stats", response_model=schemas.DashboardStats)
def get_stats(start_date: str = None, end_date: str = None, db: Session = Depends(database.get_db)):
    # Base queries with optional date filters
    q_ingresos = db.query(models.Ingreso)
    q_egresos = db.query(models.Egreso)
    
    if start_date:
        q_ingresos = q_ingresos.filter(models.Ingreso.fecha >= datetime.datetime.strptime(start_date, "%Y-%m-%d").date())
        q_egresos = q_egresos.filter(models.Egreso.fecha >= datetime.datetime.strptime(start_date, "%Y-%m-%d").date())
    if end_date:
        q_ingresos = q_ingresos.filter(models.Ingreso.fecha <= datetime.datetime.strptime(end_date, "%Y-%m-%d").date())
        q_egresos = q_egresos.filter(models.Egreso.fecha <= datetime.datetime.strptime(end_date, "%Y-%m-%d").date())

    # Total calculations
    total_ingresos = q_ingresos.with_entities(func.sum(models.Ingreso.total)).scalar() or 0.0
    total_egresos = q_egresos.with_entities(func.sum(models.Egreso.valor)).scalar() or 0.0
    utilidad_neta = total_ingresos - total_egresos
    margen_ganancia = (utilidad_neta / total_ingresos * 100) if total_ingresos > 0 else 0.0

    # PyG Consolidado
    categorias_db = db.query(models.CategoriaEgreso).all()
    clasificacion_map = {cat.nombre: cat.clasificacion_contable for cat in categorias_db}

    costos_produccion = 0.0
    gastos_administrativos = 0.0
    gastos_ventas = 0.0
    gastos_financieros = 0.0

    egresos_agrupados = q_egresos.with_entities(
        models.Egreso.categoria, 
        func.sum(models.Egreso.valor)
    ).group_by(models.Egreso.categoria).all()

    for eg in egresos_agrupados:
        cat_nombre = eg[0]
        valor = eg[1] or 0.0
        clasif = clasificacion_map.get(cat_nombre, "Costo de Producción")
        
        if clasif == "Costo de Producción": costos_produccion += valor
        elif clasif == "Gasto Administrativo": gastos_administrativos += valor
        elif clasif == "Gasto de Ventas": gastos_ventas += valor
        elif clasif == "Gasto Financiero": gastos_financieros += valor
        else: costos_produccion += valor

    utilidad_bruta = total_ingresos - costos_produccion
    utilidad_operacional = utilidad_bruta - gastos_administrativos - gastos_ventas
    utilidad_neta_pyg = utilidad_operacional - gastos_financieros

    pyg_consolidado = {
        "ingresos_operacionales": total_ingresos,
        "costos_produccion": costos_produccion,
        "utilidad_bruta": utilidad_bruta,
        "gastos_administrativos": gastos_administrativos,
        "gastos_ventas": gastos_ventas,
        "utilidad_operacional": utilidad_operacional,
        "gastos_financieros": gastos_financieros,
        "utilidad_neta": utilidad_neta_pyg
    }

    # Flujo de Caja Mensual
    ingresos_mensuales = q_ingresos.with_entities(
        func.strftime('%Y-%m', models.Ingreso.fecha).label('mes'),
        func.sum(models.Ingreso.total).label('total')
    ).group_by('mes').all()

    egresos_mensuales = q_egresos.with_entities(
        func.strftime('%Y-%m', models.Egreso.fecha).label('mes'),
        func.sum(models.Egreso.valor).label('total')
    ).group_by('mes').all()

    flujo_dict = {}
    for im in ingresos_mensuales:
        if im.mes:
            flujo_dict[im.mes] = {"name": im.mes, "ingresos": im.total or 0.0, "egresos": 0.0}
    
    for em in egresos_mensuales:
        if em.mes:
            if em.mes not in flujo_dict:
                flujo_dict[em.mes] = {"name": em.mes, "ingresos": 0.0, "egresos": 0.0}
            flujo_dict[em.mes]["egresos"] = em.total or 0.0
            
    for mes in flujo_dict:
        flujo_dict[mes]["utilidad"] = flujo_dict[mes]["ingresos"] - flujo_dict[mes]["egresos"]
        
    flujo_caja_mensual = [flujo_dict[key] for key in sorted(flujo_dict.keys())]

    # Costs by Category
    costos_cat = q_egresos.with_entities(
        models.Egreso.categoria, 
        func.sum(models.Egreso.valor).label("total")
    ).group_by(models.Egreso.categoria).all()
    costos_por_categoria = [{"category": c[0] or "General", "value": c[1] or 0.0} for c in costos_cat]

    # Costs by Type (Fixed vs Variable)
    costos_tipo = q_egresos.with_entities(
        models.Egreso.tipo, 
        func.sum(models.Egreso.valor).label("total")
    ).group_by(models.Egreso.tipo).all()
    costos_por_tipo = [{"name": c[0] or "No definido", "value": c[1] or 0.0} for c in costos_tipo]

    # Rentability by Lot
    lotes = db.query(models.Lote).all()
    rentabilidad_lotes = []
    for lote in lotes:
        l_ing = q_ingresos.filter(models.Ingreso.lote_id == lote.id).with_entities(func.sum(models.Ingreso.total)).scalar() or 0.0
        l_egr = q_egresos.filter(models.Egreso.lote_id == lote.id).with_entities(func.sum(models.Egreso.valor)).scalar() or 0.0
        rentabilidad_lotes.append({
            "name": lote.nombre,
            "ingresos": l_ing,
            "egresos": l_egr,
            "neto": l_ing - l_egr
        })

    # Rentability by Product
    productos = db.query(models.Producto).all()
    rentabilidad_productos = []
    for prod in productos:
        p_ing = q_ingresos.filter(models.Ingreso.producto_id == prod.id).with_entities(func.sum(models.Ingreso.total)).scalar() or 0.0
        p_egr = q_egresos.filter(models.Egreso.producto_id == prod.id).with_entities(func.sum(models.Egreso.valor)).scalar() or 0.0
        rentabilidad_productos.append({
            "name": prod.nombre,
            "ingresos": p_ing,
            "egresos": p_egr,
            "neto": p_ing - p_egr
        })

    return {
        "total_ingresos": total_ingresos,
        "total_egresos": total_egresos,
        "utilidad_neta": utilidad_neta,
        "margen_ganancia": margen_ganancia,
        "pyg_consolidado": pyg_consolidado,
        "flujo_caja_mensual": flujo_caja_mensual,
        "costos_por_categoria": costos_por_categoria,
        "costos_por_tipo": costos_por_tipo,
        "rentabilidad_lotes": rentabilidad_lotes,
        "rentabilidad_productos": rentabilidad_productos
    }

# --- EXPORT ---
@app.get("/export/{type}")
def export_data(type: str, db: Session = Depends(database.get_db)):
    if type == "ingresos":
        data = db.query(models.Ingreso).all()
        df = pd.DataFrame([{"fecha": i.fecha, "cantidad": i.cantidad, "precio": i.precio_unitario, "total": i.total} for i in data])
    elif type == "egresos":
        data = db.query(models.Egreso).all()
        df = pd.DataFrame([{"fecha": e.fecha, "categoria": e.categoria, "descripcion": e.descripcion, "valor": e.valor} for e in data])
    else:
        raise HTTPException(status_code=400, detail="Tipo de exportación inválido")

    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={type}_la_leonora.csv"
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
