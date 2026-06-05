# 📋 Sistema Selector CV - Municipalidad Yau

Sistema inteligente de análisis de Currículums Vitae con clasificación automática usando Machine Learning. Diseñado para municipalidades y organismos públicos.

**Estado**: ✅ Funcional (v1.0)  
**Última actualización**: Junio 2026

---

## 📊 Características

- ✅ **Análisis automático de CVs** - Extracción de texto y clasificación en 10 categorías
- ✅ **Almacenamiento SQLite** - Base de datos portátil incluida
- ✅ **Dashboard administrativo** - Métricas, gráficos y historial de análisis
- ✅ **Autenticación simple** - Login con usuario admin predeterminado
- ✅ **Visualización de datos** - Gráficos interactivos con Rosen Charts (D3.js)
- ✅ **Texto completo de CV** - Extracción y almacenamiento completo del contenido
- ✅ **API RESTful** - Backend con Flask listo para integraciones

---

## 🛠️ Stack Tecnológico

### Backend
- **Python**: 3.11 (✅ Requerido - NO usar 3.14+)
- **Framework**: Flask 3.1.3
- **Machine Learning**: TensorFlow 2.21.0 + scikit-learn 1.9.0
- **Base de Datos**: SQLite (incluida)
- **Extracción de PDFs**: PyPDF2 3.0.1
- **CORS**: Flask-CORS 6.0.2

### Frontend
- **React**: 19.2.6
- **Node.js**: 20+ (recomendado)
- **Package Manager**: pnpm 9.0.0+ (recomendado)
- **Build Tool**: Vite 8.0.12
- **CSS**: Tailwind CSS 4.3.0
- **Visualización**: D3.js 7.9.0 + Rosen Charts
- **Routing**: React Router 7.17.0
- **Iconos**: Lucide React 1.17.0

---

## 📋 Requisitos Previos

### Sistema Operativo
- Windows 10+ / macOS 10.15+ / Linux (Ubuntu 20.04+)

### Software Requerido

**Backend:**
- Python 3.11 (⚠️ **CRÍTICO**: NO usar 3.14, tiene incompatibilidad con TensorFlow)
- pip (gestor de paquetes Python)

**Frontend:**
- Node.js 20+ (descargar desde https://nodejs.org/)
- pnpm 9.0.0+ (instalar globalmente: `npm install -g pnpm`)

### Verificar Versiones Instaladas

```bash
# Python
python --version          # Debe mostrar: Python 3.11.x

# Node.js
node --version           # Debe mostrar: v20.x.x

# npm (viene con Node.js)
npm --version            # Debe mostrar: 10.x.x+

# pnpm (después de instalarlo)
pnpm --version           # Debe mostrar: 9.x.x+
```

---

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd sistema-selector-cv
```

### 2. Configurar Backend (Python)

#### 2.1 Crear Entorno Virtual

```bash
cd backend

# En Windows (PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# En macOS/Linux (bash/zsh)
python3 -m venv .venv
source .venv/bin/activate
```

#### 2.2 Instalar Dependencias

```bash
# Dentro del entorno virtual (.venv activado)
pip install -r requirements.txt
```

**Dependencias que se instalarán:**
```
flask==3.1.3
flask-cors==6.0.2
tensorflow==2.21.0
joblib==1.5.3
PyPDF2==3.0.1
numpy==2.4.6
scikit-learn==1.9.0
```

⚠️ **Notas importantes:**
- TensorFlow descargará ~500MB la primera vez
- En Windows, TensorFlow mostrará advertencias sobre OneDNN/GPU (son normales)
- scikit-learn 1.9.0 puede mostrar warnings sobre versiones (son solo warnings)

#### 2.3 Verificar Instalación

```bash
python -c "import tensorflow; print(f'TensorFlow {tensorflow.__version__} OK')"
python -c "import flask; print(f'Flask {flask.__version__} OK')"
```

---

### 3. Configurar Frontend (React + pnpm)

#### 3.1 Instalar pnpm (si no está instalado)

```bash
npm install -g pnpm
```

#### 3.2 Instalar Dependencias del Frontend

```bash
cd frontend

# Usando pnpm (recomendado)
pnpm install

# O usando npm (alternativa)
npm install
```

**Dependencias que se instalarán:**
```json
{
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-router-dom": "^7.17.0",
  "tailwindcss": "^4.3.0",
  "@tailwindcss/vite": "^4.3.0",
  "d3": "^7.9.0",
  "vite": "^8.0.12",
  "lucide-react": "^1.17.0"
}
```

---

## 🚀 Ejecutar el Sistema

### Terminal 1: Backend (Flask)

```bash
cd backend

# Activar entorno virtual
# Windows:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Ejecutar servidor Flask
python app.py
```

**Salida esperada:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

✅ Backend disponible en: **http://localhost:5000**

---

### Terminal 2: Frontend (React + Vite)

```bash
cd frontend

# Ejecutar servidor de desarrollo
pnpm dev

# O con npm
npm run dev
```

**Salida esperada:**
```
  VITE v8.0.12  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Frontend disponible en: **http://localhost:5173**

---

## 🔐 Credenciales de Acceso

**Único usuario admin predefinido:**

| Campo | Valor |
|-------|-------|
| **DNI** | `12345678` |
| **Contraseña** | `admin123` |
| **Rol** | admin |

⚠️ **IMPORTANTE**: Cambiar estas credenciales antes de producción.

---

## 📱 Flujo de Usuario

1. **Login**: Acceder con credenciales admin
2. **Panel**: Ver estadísticas y métricas de CVs analizados
3. **Analizar CV**: 
   - Hacer click en "Analizar CV"
   - Cargar archivo PDF (drag & drop o click)
   - Esperar análisis automático (~2-5 segundos)
   - Ver resultados con categoría y confianza
4. **Historial**: 
   - Ver todos los CVs analizados
   - Hacer click para ver detalles completos
   - Ver texto extraído del PDF

---

## 🏗️ Estructura del Proyecto

```
sistema-selector-cv/
│
├── backend/                          # API Flask (Python)
│   ├── app.py                        # Aplicación principal
│   ├── database.py                   # Gestión SQLite
│   ├── requirements.txt              # Dependencias Python
│   ├── municipalidad.db              # Base de datos (auto-creada)
│   ├── .venv/                        # Entorno virtual
│   ├── modelos/                      # Modelos Machine Learning
│   │   ├── modelo_clasificador_cv.h5 # Red neuronal (19.2 MB)
│   │   ├── vectorizador_cv.pkl       # TF-IDF Vectorizer
│   │   └── encoder_categorias_cv.pkl # Label Encoder
│   ├── routes/
│   │   ├── auth.py                   # Endpoints de autenticación
│   │   └── cv.py                     # Endpoints de análisis CVs
│   └── uploads/                      # CVs subidos (temp)
│
├── frontend/                         # App React
│   ├── package.json                  # Dependencias Node.js
│   ├── pnpm-lock.yaml                # Lock file pnpm
│   ├── vite.config.js                # Configuración Vite
│   ├── tailwind.config.js            # Configuración Tailwind
│   ├── postcss.config.js             # Configuración PostCSS
│   ├── src/
│   │   ├── App.jsx                   # Componente raíz
│   │   ├── main.jsx                  # Entry point
│   │   ├── index.css                 # Estilos globales
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Página de login
│   │   │   ├── AdminDashboard.jsx    # Panel de estadísticas
│   │   │   ├── CVAnalyzer.jsx        # Análisis de CVs
│   │   │   ├── AdminCVList.jsx       # Historial de CVs
│   │   │   └── Home.jsx              # Landing page
│   │   ├── components/
│   │   │   ├── Layout.jsx            # Sidebar + navegación
│   │   │   ├── FileUpload.jsx        # Carga de archivos
│   │   │   ├── BarLineChart.jsx      # Gráficos D3.js
│   │   │   ├── ClientTooltip.jsx     # Tooltips
│   │   │   ├── LoadingSpinner.jsx    # Indicador de carga
│   │   │   └── CVDetailModal.jsx     # Modal de detalle
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Estado de autenticación
│   │   └── lib/
│   │       └── api.js                # Cliente HTTP (fetch)
│   └── index.html                    # HTML template
│
├── README.md                         # Este archivo
├── mejora.md                         # Propuestas de mejora arquitectónica
└── .gitignore
```

---

## 🔌 API Endpoints

### Autenticación

**POST** `/api/auth/login`
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"dni":"12345678","password":"admin123"}'
```
**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "dni": "12345678",
    "rol": "admin"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### Análisis de CV

**POST** `/api/analizar-cv` (multipart/form-data)
```bash
curl -X POST http://localhost:5000/api/analizar-cv \
  -H "Authorization: Bearer <token>" \
  -F "file=@cv.pdf"
```
**Response:**
```json
{
  "id": 1,
  "categoria": "Engineering",
  "confianza": 0.92,
  "probabilidades": {
    "Data Science": 0.05,
    "Engineering": 0.92,
    ...
  },
  "texto_muestra": "Juan Pérez... (primeros 500 caracteres)",
  "texto_completo": "Juan Pérez... (texto completo extraído)",
  "created_at": "2026-06-05T10:30:45"
}
```

---

### Historial de CVs

**GET** `/api/cv/historial?page=1&limit=10`
```bash
curl http://localhost:5000/api/cv/historial \
  -H "Authorization: Bearer <token>"
```
**Response:**
```json
{
  "total": 25,
  "page": 1,
  "data": [
    {
      "id": 1,
      "filename": "cv_juan.pdf",
      "categoria": "Engineering",
      "confianza": 0.92,
      "created_at": "2026-06-05T10:30:45"
    }
  ]
}
```

---

### Detalle de CV

**GET** `/api/cv/<id>`
```bash
curl http://localhost:5000/api/cv/1 \
  -H "Authorization: Bearer <token>"
```

---

### Estadísticas

**GET** `/api/cv/stats`
```bash
curl http://localhost:5000/api/cv/stats \
  -H "Authorization: Bearer <token>"
```
**Response:**
```json
{
  "total_cvs": 42,
  "confianza_promedio": 0.87,
  "categorias": {
    "Engineering": 12,
    "Data Science": 8,
    ...
  },
  "ultimos_7_dias": 15
}
```

---

### Eliminar CV

**DELETE** `/api/cv/<id>`
```bash
curl -X DELETE http://localhost:5000/api/cv/1 \
  -H "Authorization: Bearer <token>"
```

---

### Health Check

**GET** `/api/health`
```bash
curl http://localhost:5000/api/health
```
**Response:**
```json
{
  "status": "ok",
  "version": "1.0"
}
```

---

## 💾 Base de Datos

### Ubicación
`backend/municipalidad.db` (SQLite)

Se crea automáticamente al iniciar el backend por primera vez.

### Schema

#### Tabla: `ciudadanos`
```sql
CREATE TABLE ciudadanos (
    id INTEGER PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Datos iniciales:**
- DNI: 12345678
- Nombre: Admin
- Rol: admin
- Contraseña: admin123

#### Tabla: `cv_analisis`
```sql
CREATE TABLE cv_analisis (
    id INTEGER PRIMARY KEY,
    ciudadano_id INTEGER NOT NULL,
    filename VARCHAR(255),
    categoria VARCHAR(100),
    confianza REAL,
    probabilidades TEXT,  -- JSON
    texto_muestra TEXT,
    texto_completo LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ciudadano_id) REFERENCES ciudadanos(id)
);
```

### Limpiar Base de Datos

Si necesitas resetear la BD:

```bash
# Windows
cd backend
del municipalidad.db

# macOS/Linux
cd backend
rm municipalidad.db

# Reiniciar backend (recreará la BD)
python app.py
```

---

## 🧠 Modelos de Machine Learning

### Ubicación
`backend/modelos/`

### Archivos
1. **modelo_clasificador_cv.h5** (19.2 MB)
   - Red neuronal TensorFlow
   - Entrenada con 332 CVs reales
   - Clasifica en 10 categorías

2. **vectorizador_cv.pkl** (0.11 MB)
   - TF-IDF Vectorizer
   - Convierte texto en vectores numéricos

3. **encoder_categorias_cv.pkl** (<0.01 MB)
   - Label Encoder
   - Mapea categorías a números

### Categorías Disponibles
1. Data Science
2. Engineering
3. Marketing
4. HR
5. Finance
6. Advocate
7. Arts
8. Sales
9. Healthcare
10. IT

---

## 🎨 Configuración Frontend

### Variables de Entorno (Frontend)

Crear archivo `frontend/.env.local`:

```
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
```

### Proxy API (Automático)

Vite ya está configurado para redirigir `/api/*` a `http://localhost:5000/api/*`

Configuración en `frontend/vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

---

## 🔧 Comandos Disponibles

### Backend

```bash
# Activar entorno virtual
cd backend
.\.venv\Scripts\Activate.ps1  # Windows
source .venv/bin/activate      # macOS/Linux

# Ejecutar servidor
python app.py

# Ejecutar con debug mode
FLASK_ENV=development python app.py

# Desactivar entorno virtual
deactivate
```

### Frontend

```bash
cd frontend

# Instalar dependencias (pnpm recomendado)
pnpm install

# Ejecutar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview de build
pnpm preview

# Linting
pnpm lint

# Con npm (alternativa)
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 🐛 Troubleshooting

### Backend

#### ❌ "Python 3.14 incompatible"
```
Error: TensorFlow no carga en Python 3.14
```
**Solución:** Cambiar a Python 3.11
```bash
python3.11 --version
python3.11 -m venv .venv
```

#### ❌ "ModuleNotFoundError: No module named 'tensorflow'"
```
Error al iniciar backend
```
**Solución:** Asegurar que el entorno virtual esté activado
```bash
# Windows
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

#### ❌ "Port 5000 already in use"
```
Address already in use
```
**Solución:** Cambiar puerto o matar proceso anterior
```bash
# En Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# En macOS/Linux
lsof -i :5000
kill -9 <PID>
```

#### ❌ "CORS error"
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solución:** Backend debe estar corriendo en puerto 5000
```bash
python app.py  # Verificar que diga http://127.0.0.1:5000
```

---

### Frontend

#### ❌ "pnpm not found"
```
pnpm: command not found
```
**Solución:** Instalar pnpm globalmente
```bash
npm install -g pnpm
pnpm --version
```

#### ❌ "Port 5173 already in use"
```
Port 5173 is in use
```
**Solución:** Especificar puerto diferente
```bash
pnpm dev -- --port 5174
```

#### ❌ "Node modules corrupted"
```
Cannot find module
```
**Solución:** Limpiar e reinstalar
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### ❌ "Vite build failures"
```
Build error: unexpected token
```
**Solución:** Limpiar caché de Vite
```bash
pnpm exec vite --force
rm -rf dist node_modules/.vite
pnpm build
```

---

## 📊 Flujo de Análisis de CV

```
1. Usuario sube PDF
   ↓
2. PyPDF2 extrae texto
   ↓
3. Limpieza regex (remove emails, phones, etc)
   ↓
4. TF-IDF vectoriza el texto
   ↓
5. Red neuronal predice categoría
   ↓
6. Resultado se almacena en SQLite
   ↓
7. Frontend muestra resultados
   ↓
8. Usuario ve detalles + texto completo
```

**Tiempo promedio**: 2-5 segundos por CV

---

## 📈 Ejemplos de Uso

### Ejemplo 1: Subir un CV

```bash
# 1. Hacer login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"dni":"12345678","password":"admin123"}' | jq -r .token)

# 2. Subir CV
curl -X POST http://localhost:5000/api/analizar-cv \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./mi_cv.pdf"
```

### Ejemplo 2: Ver historial

```bash
TOKEN="tu_token_aqui"

curl http://localhost:5000/api/cv/historial \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Ejemplo 3: Ver estadísticas

```bash
TOKEN="tu_token_aqui"

curl http://localhost:5000/api/cv/stats \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🚀 Deployment (Próximas versiones)

Ver documento **mejora.md** para propuestas de:
- ✅ Dockerización
- ✅ PostgreSQL
- ✅ Kubernetes
- ✅ CI/CD con GitHub Actions
- ✅ Producción en AWS/Azure

---

## ⚠️ Notas Importantes

### Seguridad
- ⚠️ **NO** usar en producción sin cambiar credenciales
- ⚠️ Las contraseñas están en texto plano (usar Argon2 en producción)
- ⚠️ CORS está abierto a todos (restringir en producción)

### Rendimiento
- ⚠️ TensorFlow muestra warnings en Windows (normales, sin impacto)
- ⚠️ Primer análisis puede ser más lento (model warmup)
- ⚠️ SQLite no escala > 100 usuarios concurrentes

### Compatibilidad
- ⚠️ Python 3.14+ NO soportado (usar 3.11)
- ⚠️ Node.js < 18 puede tener issues con pnpm

---

## 📚 Documentación Relacionada

- **mejora.md** - Propuestas de mejora arquitectónica (seguridad, escalabilidad, DevOps)
- **API Endpoints** - Ver sección de Endpoints arriba
- **Stack Tecnológico** - Ver sección al inicio

---

## 🤝 Contribuciones

Para mejorar este sistema, consulta **mejora.md** para el roadmap planificado.

---

## 📄 Licencia

MIT License - Ver LICENSE file

---

## ❓ Preguntas Frecuentes

### P: ¿Puedo usar Python 3.12 o 3.13?
R: **NO**. TensorFlow 2.21.0 requiere Python 3.11. Usar 3.12+ causa crashes.

### P: ¿Funciona en Mac M1/M2?
R: Sí, pero requiere `tensorflow-macos` en lugar de `tensorflow`. Ver requirements.txt para tu SO.

### P: ¿Cuánto espacio ocupa?
R: ~500MB (dependencias) + 50MB (modelos) + 10MB (base de datos inicial)

### P: ¿Cómo agrego más usuarios?
R: Modificar base de datos SQLite o crear endpoint de registro (ver mejora.md)

### P: ¿Puedo cambiar el puerto?
R: **Backend**: No fácilmente (hardcoded en app.py)  
**Frontend**: `pnpm dev -- --port 3000`

### P: ¿Qué hacer si pierde la BD?
R: Eliminar `municipalidad.db` y reiniciar backend (se recrea automáticamente)

---

## 📞 Soporte

Para reportar bugs o sugerencias:
- Crear issue en GitHub
- Consultar **mejora.md** para roadmap futuro

---

**Versión del Documento**: 1.0  
**Última actualización**: Junio 2026  
**Mantenedor**: Municipalidad Yau
