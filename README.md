# La Leonora - Gestión Agrícola e Inteligencia de Negocios

Este proyecto es una plataforma moderna para la gestión financiera y operativa de la finca "La Leonora". Permite el seguimiento detallado de ingresos, egresos, rentabilidad por lote y análisis de KPIs.

## Estructura del Proyecto

- `/backend`: API construida con **FastAPI** (Python), SQLAlchemy y SQLite/PostgreSQL.
- `/frontend`: Aplicación web moderna construida con **Next.js 15**, Tailwind CSS y Recharts.

---

## Instrucciones de Instalación y Ejecución

### 1. Backend (Python)

Requisitos: Python 3.9+

1. Entra al directorio del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Ejecuta el servidor:
   ```bash
   python main.py
   ```
   El servidor estará disponible en `http://localhost:8000`. Puedes ver la documentación interactiva en `http://localhost:8000/docs`.

### 2. Frontend (React/Next.js)

Requisitos: Node.js 18+

1. Entra al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el entorno de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## Funcionalidades Incluidas

- **Dashboard BI:** Visualización interactiva de ingresos vs egresos, utilidad neta y distribución de costos.
- **Módulo de Lotes:** Registro y monitoreo de las divisiones de la finca y sus cultivos.
- **Control de Ingresos:** Registro de producción y ventas con cálculo automático de totales.
- **Control de Egresos:** Clasificación de gastos fijos/variables y alertas de sobrecostos.
- **Exportación:** Endpoints listos para descargar reportes en formato CSV.
- **Diseño Premium:** Interfaz responsiva con estética natural/agrícola.

---

## Tecnologías Utilizadas

- **Backend:** FastAPI, SQLite (SQLAlchemy), Pandas (para reportes).
- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide Icons, Recharts (Gráficos), Framer Motion (Animaciones).
