# Documento de Mejoras Arquitectónicas
## Sistema Selector CV - Municipalidad Yau
**Fecha**: Junio 2026 | **Versión**: 1.0 | **Estado**: Propuesta

---

## Ejecutivo

El sistema actual (v1.0) funciona correctamente pero tiene vulnerabilidades críticas, limitaciones de escalabilidad y oportunidades de optimización. Este documento propone una arquitectura mejorada que mantenga la simplicidad actual mientras agrega robustez, seguridad y preparación para crecimiento.

**Impacto estimado:**
- ⚠️ **Crítico (inmediato)**: 5 mejoras de seguridad
- 📈 **Alto (próximo sprint)**: 8 mejoras de arquitectura
- 🎯 **Medio (backlog)**: 6 mejoras de rendimiento/UX

---

## 1. SEGURIDAD (🚨 Crítico)

### 1.1 Autenticación y Autorización

**Problema actual:**
- Contraseña en texto plano en BD (`password = "admin123"`)
- Sin hashing (bcrypt/argon2)
- Sin rate limiting en login
- JWT sin expiración/refresh tokens
- Sin RBAC (Role-Based Access Control) real

**Mejora propuesta:**

```python
# backend/utils/security.py (NUEVO)
from argon2 import PasswordHasher
from datetime import datetime, timedelta
import jwt

class AuthManager:
    def __init__(self, secret_key: str, token_expiry: int = 3600):
        self.hasher = PasswordHasher()
        self.secret_key = secret_key
        self.token_expiry = token_expiry
    
    def hash_password(self, password: str) -> str:
        """Hash con Argon2 (resistente a GPU bruteforce)"""
        return self.hasher.hash(password)
    
    def verify_password(self, password: str, hash: str) -> bool:
        try:
            self.hasher.verify(hash, password)
            return True
        except:
            return False
    
    def create_token(self, user_id: str, rol: str, exp: int = None) -> str:
        """JWT con expiración y refresh token"""
        payload = {
            'user_id': user_id,
            'rol': rol,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(seconds=exp or self.token_expiry)
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
```

**Implementación:**
1. Migrar contraseñas existentes a Argon2
2. Requerir JWT en todos los endpoints (excepto `/login`)
3. Agregar rate limiting (Flask-Limiter): máx 5 intentos/minuto por IP
4. Implementar refresh tokens (7 días)
5. Validar token en middleware

**Archivo**: `backend/middleware/auth.py`

---

### 1.2 CORS y Control de Acceso

**Problema actual:**
```python
# backend/app.py
CORS(app)  # ❌ Acepta TODO (*)
```

**Mejora propuesta:**

```python
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(","),
        "methods": ["GET", "POST", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["X-Total-Count"],
        "max_age": 3600,
        "supports_credentials": True
    }
})
```

**Beneficio**: Previene ataques CSRF y acceso no autorizado desde otros dominios.

---

### 1.3 Validación de Entrada

**Problema actual:**
- Sin validación de tipos en upload PDF
- Sin límite de tamaño de archivo
- Sin sanitización de nombres

**Mejora propuesta:**

```python
# backend/validators.py (NUEVO)
from marshmallow import Schema, fields, ValidationError
import os

class CVUploadSchema(Schema):
    file = fields.Raw(required=True)
    
    def validate_file(self, data):
        file = data.get('file')
        MAX_SIZE = 10 * 1024 * 1024  # 10 MB
        ALLOWED_TYPES = {'application/pdf'}
        
        if not file:
            raise ValidationError("Archivo requerido")
        if file.content_length > MAX_SIZE:
            raise ValidationError("Archivo > 10MB")
        if file.content_type not in ALLOWED_TYPES:
            raise ValidationError("Solo PDFs permitidos")
```

**Implementación**: Usar `Marshmallow` para schema validation en todos los endpoints.

---

### 1.4 Encriptación de Datos Sensibles

**Problema actual:**
- `texto_completo` sin encripción (puede contener datos personales)
- API expone directamente sin sanitización

**Mejora propuesta:**

```python
# backend/utils/encryption.py (NUEVO)
from cryptography.fernet import Fernet
import os

class DataEncryptor:
    def __init__(self):
        key = os.getenv("ENCRYPTION_KEY")
        if not key:
            raise ValueError("ENCRYPTION_KEY no configurada")
        self.cipher = Fernet(key)
    
    def encrypt(self, plaintext: str) -> str:
        return self.cipher.encrypt(plaintext.encode()).decode()
    
    def decrypt(self, ciphertext: str) -> str:
        return self.cipher.decrypt(ciphertext.encode()).decode()
```

**Beneficio**: Protege PII (Personally Identifiable Information) en reposo.

---

### 1.5 Auditoría y Logging

**Problema actual:**
- Sin logs de acceso/modificación
- Sin trazabilidad de quién hizo qué

**Mejora propuesta:**

```python
# backend/models.py - agregar tabla
class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('ciudadanos.id'))
    action = db.Column(db.String(50))  # login, upload_cv, delete_cv
    resource = db.Column(db.String(100))  # cv_id, details
    status = db.Column(db.String(20))  # success, failure
    ip_address = db.Column(db.String(45))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
```

**Implementación**: Interceptar todas las acciones en middleware.

---

## 2. ARQUITECTURA (📈 Alto)

### 2.1 Migración a PostgreSQL

**Problema actual:**
- SQLite: concurrencia limitada, sin soporte JSON-native
- Single file, sin replicación
- No soporta índices avanzados

**Mejora propuesta:**

```yaml
# docker-compose.yml (NUEVO)
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: municipalidad
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/municipalidad
    ports:
      - "5000:5000"
```

**Beneficio**: 
- Soporte para 1000+ usuarios concurrentes
- JSONB para `probabilidades`
- Backups automáticos
- Clustering para HA

---

### 2.2 Arquitectura en Capas (Clean Architecture)

**Problema actual:**
- Lógica mezclada en `app.py` y `routes/`
- Sin separación de concerns
- Difícil de testear

**Mejora propuesta:**

```
backend/
├── app.py                 # Solo inicialización Flask
├── config.py              # Configuración (NUEVO)
├── constants.py           # Constantes (NUEVO)
├── domain/                # Lógica de negocio (NUEVO)
│   ├── models.py
│   ├── repositories.py
│   └── services.py
├── application/           # Use cases (NUEVO)
│   ├── auth_service.py
│   ├── cv_service.py
│   └── analytics_service.py
├── infrastructure/        # Detalles técnicos (NUEVO)
│   ├── database.py
│   ├── external_services.py
│   └── caching.py
├── presentation/          # API endpoints (NUEVO)
│   ├── routes/
│   ├── schemas.py
│   └── middleware.py
└── utils/                 # Helpers
    ├── security.py
    ├── encryption.py
    └── validators.py
```

**Implementación:**

```python
# backend/domain/repositories.py (NUEVO)
from abc import ABC, abstractmethod

class CiudadanoRepository(ABC):
    @abstractmethod
    def find_by_dni(self, dni: str) -> Ciudadano: pass
    
    @abstractmethod
    def save(self, ciudadano: Ciudadano) -> Ciudadano: pass

class SQLiteCiudadanoRepository(CiudadanoRepository):
    def find_by_dni(self, dni: str):
        # Implementación específica de SQLite
        pass
```

**Beneficio**: Desacoplamiento, testabilidad, fácil migración a otras BDs.

---

### 2.3 Caché Distribuido

**Problema actual:**
- Modelos ML se cargan en cada request
- Stats se recalculan siempre
- Sin caché de sesión

**Mejora propuesta:**

```python
# backend/infrastructure/caching.py (NUEVO)
import redis
from functools import wraps

cache = redis.Redis(host='localhost', port=6379, db=0)

def cached(ttl: int = 3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            result = cache.get(key)
            if result:
                return json.loads(result)
            
            result = func(*args, **kwargs)
            cache.setex(key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator

# Uso:
@cached(ttl=3600)
def get_statistics():
    # Cálculos complejos aquí
    pass
```

**Configuración:**

```yaml
# docker-compose.yml - agregar servicio
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
```

**Beneficio**: 90% reducción en latencia de estadísticas.

---

### 2.4 Procesamiento Asincrónico

**Problema actual:**
- Upload CV bloquea (espera análisis IA)
- Sin queue de tareas
- Sin notificaciones en tiempo real

**Mejora propuesta:**

```python
# backend/infrastructure/tasks.py (NUEVO)
from celery import Celery
import os

celery = Celery(
    'cv_analyzer',
    broker=os.getenv('REDIS_URL', 'redis://localhost:6379'),
    backend=os.getenv('REDIS_URL', 'redis://localhost:6379')
)

@celery.task(bind=True, max_retries=3)
def analyze_cv_async(self, cv_id: str):
    try:
        # Análisis pesado aquí
        service = CVAnalysisService()
        service.analyze(cv_id)
    except Exception as exc:
        # Reintentos exponenciales
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)

# Backend:
@bp.route('/api/analizar-cv', methods=['POST'])
def upload_cv():
    cv = save_cv(file)
    analyze_cv_async.delay(cv.id)  # Non-blocking
    return {'status': 'queued', 'cv_id': cv.id}, 202
```

**Beneficio**: 
- Response inmediato (202 Accepted)
- Análisis en paralelo
- Escalabilidad horizontal

---

### 2.5 Versionado de API

**Problema actual:**
- Sin versioning (`/api/...`)
- Cambios rompen clientes
- Sin deprecation warnings

**Mejora propuesta:**

```
backend/
├── presentation/
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── auth.py
│   │   │   ├── cv.py
│   │   │   └── __init__.py
│   │   └── v2/
│   │       ├── auth.py
│   │       ├── cv.py
│   │       └── __init__.py
```

```python
# backend/app.py
from presentation.routes.v1 import auth_bp_v1, cv_bp_v1
from presentation.routes.v2 import auth_bp_v2, cv_bp_v2

app.register_blueprint(auth_bp_v1, url_prefix='/api/v1')
app.register_blueprint(cv_bp_v1, url_prefix='/api/v1')

app.register_blueprint(auth_bp_v2, url_prefix='/api/v2')
app.register_blueprint(cv_bp_v2, url_prefix='/api/v2')
```

**Beneficio**: Evolución sin romper compatibilidad.

---

## 3. RENDIMIENTO (🎯 Medio)

### 3.1 Índices de Base de Datos

**Problema actual:**
- Sin índices personalizados
- Queries lentas en 1M+ registros

**Mejora propuesta:**

```sql
-- backend/migrations/001_add_indexes.sql
CREATE INDEX idx_cv_analisis_ciudadano_id ON cv_analisis(ciudadano_id);
CREATE INDEX idx_cv_analisis_categoria ON cv_analisis(categoria);
CREATE INDEX idx_cv_analisis_created_at ON cv_analisis(created_at DESC);
CREATE INDEX idx_ciudadanos_dni ON ciudadanos(dni);

-- Índice full-text search en texto_completo
CREATE INDEX idx_cv_analisis_texto_gin ON cv_analisis USING GIN(to_tsvector('spanish', texto_completo));
```

**Beneficio**: Queries 50-100x más rápidas.

---

### 3.2 Compresión de Modelos ML

**Problema actual:**
- Modelo 19.19 MB cargado siempre en RAM
- Startup lento

**Mejora propuesta:**

```python
# backend/infrastructure/ml_loader.py (NUEVO)
import tensorflow as tf
from tensorflow.lite.python import lite_constants

def convert_to_tflite():
    """Reducir modelo de 19MB a 5-8MB"""
    model = tf.keras.models.load_model('modelos/modelo_clasificador_cv.h5')
    
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS,
        tf.lite.OpsSet.SELECT_TF_OPS
    ]
    
    tflite_model = converter.convert()
    with open('modelos/modelo_clasificador_cv.tflite', 'wb') as f:
        f.write(tflite_model)
```

**Beneficio**: 60% reducción de tamaño, 40% más rápido.

---

### 3.3 Streaming de Respuestas Grandes

**Problema actual:**
- Endpoint `texto_completo` descarga todo en RAM

**Mejora propuesta:**

```python
from flask import Response
import io

@bp.route('/api/cv/<int:cv_id>/texto/download', methods=['GET'])
def download_texto_completo(cv_id):
    cv = CVAnalisis.query.get(cv_id)
    
    def generate():
        # Stream 1MB chunks
        texto = cv.texto_completo or ''
        for i in range(0, len(texto), 1024*1024):
            yield texto[i:i+1024*1024]
    
    return Response(
        generate(),
        mimetype='text/plain',
        headers={"Content-Disposition": "attachment;filename=cv.txt"}
    )
```

**Beneficio**: Maneja textos > 1GB sin crashes.

---

## 4. TESTABILIDAD (QA)

### 4.1 Testing Pyramid

**Problema actual:**
- Sin tests automatizados
- Sin CI/CD

**Mejora propuesta:**

```
tests/
├── unit/
│   ├── test_auth_service.py
│   ├── test_cv_service.py
│   └── test_validators.py
├── integration/
│   ├── test_auth_flow.py
│   ├── test_cv_upload_flow.py
│   └── test_database.py
├── e2e/
│   ├── test_full_user_journey.py
│   └── conftest.py
└── fixtures/
    ├── sample_cv.pdf
    └── mock_data.py
```

**Implementación:**

```python
# tests/unit/test_auth_service.py
import pytest
from backend.application.auth_service import AuthService

@pytest.fixture
def auth_service():
    return AuthService(secret_key="test-key")

def test_password_hashing():
    service = auth_service()
    hash1 = service.hash_password("mipassword")
    assert service.verify_password("mipassword", hash1)
    assert not service.verify_password("wrongpassword", hash1)

def test_jwt_creation():
    service = auth_service()
    token = service.create_token("user123", "admin")
    payload = service.verify_token(token)
    assert payload['user_id'] == "user123"
```

**CI/CD (GitHub Actions):**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r backend/requirements.txt
          pip install pytest pytest-cov
      
      - name: Run tests
        run: pytest tests/ --cov=backend
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 5. OBSERVABILIDAD (Monitoring)

### 5.1 Logging Estructurado

**Problema actual:**
- Sin logs centralizados
- Difícil debuggear issues

**Mejora propuesta:**

```python
# backend/utils/logging.py (NUEVO)
import logging
import json

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        if hasattr(record, 'user_id'):
            log_data['user_id'] = record.user_id
        return json.dumps(log_data)

# Configuración
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
```

**Beneficio**: Parseable en ELK Stack / CloudWatch.

---

### 5.2 Métricas y APM

**Problema actual:**
- Sin visibilidad en performance
- Sin alertas

**Mejora propuesta:**

```python
# backend/infrastructure/metrics.py (NUEVO)
from prometheus_client import Counter, Histogram, Gauge

# Contadores
cv_upload_counter = Counter('cv_uploads_total', 'Total CV uploads')
cv_analysis_errors = Counter('cv_analysis_errors_total', 'Analysis errors')

# Histogramas
analysis_duration = Histogram(
    'cv_analysis_duration_seconds',
    'Analysis time',
    buckets=(0.5, 1, 2, 5, 10)
)

# Medidores
active_analyses = Gauge('active_analyses', 'In-progress analyses')

# Uso:
@bp.route('/api/analizar-cv', methods=['POST'])
def upload_cv():
    active_analyses.inc()
    try:
        with analysis_duration.time():
            # Análisis aquí
            pass
        cv_upload_counter.inc()
    except Exception as e:
        cv_analysis_errors.inc()
        raise
    finally:
        active_analyses.dec()
```

**Visualización en Grafana:**

```yaml
# docker-compose.yml - agregar
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana:latest
  ports:
    - "3000:3000"
  environment:
    GF_SECURITY_ADMIN_PASSWORD: admin
```

---

## 6. OPERACIONES (DevOps)

### 6.1 Containerización

**Problema actual:**
- Sin Docker
- Difícil reproducir entorno

**Mejora propuesta:**

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV FLASK_ENV=production

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### 6.2 Orchestración (Kubernetes Ready)

**Mejora propuesta:**

```yaml
# k8s/deployment.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: municipalidad

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: municipalidad
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: municipalidad/backend:1.0
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 5
```

---

## 7. DOCUMENTACIÓN

### 7.1 API Documentation (OpenAPI/Swagger)

**Mejora propuesta:**

```python
# backend/app.py
from flasgger import Swagger

swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Municipalidad CV Analyzer API",
        "version": "1.0",
        "description": "Sistema de análisis de CVs"
    }
})

@bp.route('/api/v1/analizar-cv', methods=['POST'])
def upload_cv():
    """
    Analizar CV
    ---
    parameters:
      - in: formData
        name: file
        type: file
        required: true
        description: Archivo PDF del CV
    responses:
      201:
        description: Análisis completado
      400:
        description: Archivo inválido
    """
    pass
```

**Acceso**: `/apidocs`

---

## Plan de Implementación

### Fase 1: Seguridad (Semana 1-2)
- [ ] Migrar a Argon2 + JWT
- [ ] Implementar rate limiting
- [ ] Agregar validación de entrada
- [ ] Configurar CORS correcto

### Fase 2: Arquitectura (Semana 3-4)
- [ ] Refactorizar a capas
- [ ] Implementar Repository Pattern
- [ ] Agregar caché Redis
- [ ] Versionado de API

### Fase 3: Infraestructura (Semana 5-6)
- [ ] Migrar a PostgreSQL
- [ ] Dockerizar aplicación
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Implementar tests

### Fase 4: Observabilidad (Semana 7)
- [ ] Logging estructurado
- [ ] Prometheus + Grafana
- [ ] Alertas

### Fase 5: Optimización (Backlog)
- [ ] Procesamiento async con Celery
- [ ] Compresión de modelos ML
- [ ] Índices de BD
- [ ] Kubernetes deployment

---

## Matriz de Decisión

| Aspecto | Actual | Propuesta | Beneficio | Riesgo |
|--------|--------|-----------|-----------|--------|
| **DB** | SQLite | PostgreSQL | Concurrencia, JSONB | Cambio de ORM |
| **Contraseñas** | Plaintext | Argon2 | Seguridad 🔐 | Migración de datos |
| **Caché** | None | Redis | 90% latencia ↓ | Complejidad operacional |
| **Async** | Synchronous | Celery | Escalabilidad | Debugging más complejo |
| **Logging** | Print statements | ELK/CloudWatch | Observabilidad | Almacenamiento |
| **Container** | None | Docker | Reproducibilidad | Curva de aprendizaje |

---

## Estimaciones de Esfuerzo

| Tarea | Horas | Prioridad |
|-------|-------|-----------|
| Seguridad (Fases 1) | 40h | 🔴 Crítica |
| Arquitectura (Fase 2) | 60h | 🟠 Alta |
| Infraestructura (Fase 3) | 50h | 🟡 Media |
| Observabilidad (Fase 4) | 30h | 🟢 Baja |
| Optimización (Fase 5) | 40h | 🟢 Baja |
| **Total** | **220h** | - |

---

## ROI Proyectado

- **Antes**: 1 municipio, 100 usuarios/año, 0 uptime SLA
- **Después**: N municipios, 10k usuarios/año, 99.9% SLA
- **Ingresos adicionales**: $50k-200k/año
- **Inversión**: 220h desarrollo (~$20k USD)
- **Payback**: 2-3 meses

---

## Conclusiones

El sistema actual es funcional pero requiere hardening antes de producción. Las mejoras propuestas:

✅ **Protegen datos** (encriptación, hashing)  
✅ **Escalan horizontalmente** (async, caché, PostgreSQL)  
✅ **Facilitan mantenimiento** (testing, logging, observabilidad)  
✅ **Preparan para crecimiento** (Kubernetes, multi-tenant)  

**Siguiente paso**: Aprobar Phase 1 (Seguridad) e iniciar sprint.

---

## Apéndices

### A. Dependencias Nuevas Recomendadas

```
# backend/requirements.txt - agregar

# Seguridad
argon2-cffi==21.3.0
PyJWT==2.8.0
Flask-Limiter==3.5.0
cryptography==41.0.0

# Arquitectura
Flask-SQLAlchemy==3.1.1
marshmallow==3.20.1
redis==5.0.0
celery==5.3.4

# Testing
pytest==7.4.3
pytest-cov==4.1.0
pytest-flask==1.3.0

# Observabilidad
python-json-logger==2.0.7
prometheus-client==0.19.0

# DevOps
gunicorn==21.2.0
python-dotenv==1.0.0
```

### B. Plantilla `.env` Recomendada

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/municipalidad

# Security
SECRET_KEY=your-super-secret-key-min-32-chars
ENCRYPTION_KEY=your-fernet-key-32-chars
JWT_EXPIRY=3600

# External Services
REDIS_URL=redis://localhost:6379/0
ANTHROPIC_API_KEY=sk_...

# Configuration
ALLOWED_ORIGINS=http://localhost:5173,https://municipalidad.gob.ar
FLASK_ENV=production
LOG_LEVEL=INFO
```

---

**Documento preparado por**: OpenCode AI  
**Última actualización**: Junio 2026  
**Licencia**: MIT
