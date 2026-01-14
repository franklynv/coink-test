# 📡 Ejemplos de Uso de la API

## Base URL

```
http://localhost:5000/api
```

---

## Endpoints Disponibles

### 1. Listar Países

**GET** `/locations/countries`

```bash
curl http://localhost:5000/api/locations/countries
```

**Response (200 OK)**
```json
[
  {
    "id": 1,
    "name": "Colombia",
    "isoCode": "CO"
  },
  {
    "id": 2,
    "name": "Perú",
    "isoCode": "PE"
  },
  {
    "id": 3,
    "name": "México",
    "isoCode": "MX"
  }
]
```

---

### 2. Listar Departamentos por País

**GET** `/locations/departments/{countryId}`

```bash
# Departamentos de Colombia (id=1)
curl http://localhost:5000/api/locations/departments/1
```

**Response (200 OK)**
```json
[
  {
    "id": 1,
    "name": "Bogotá D.C."
  },
  {
    "id": 2,
    "name": "Antioquia"
  }
]
```

---

### 3. Listar Municipios por Departamento

**GET** `/locations/municipalities/{departmentId}`

```bash
# Municipios de Bogotá D.C. (id=1)
curl http://localhost:5000/api/locations/municipalities/1
```

**Response (200 OK)**
```json
[
  {
    "id": 1,
    "name": "Bogotá"
  }
]
```

---

### 4. Crear Usuario

**POST** `/users`

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez García",
    "phone": "3001234567",
    "address": "Calle 123 #45-67, Apto 301",
    "countryId": 1,
    "departmentId": 1,
    "municipalityId": 1
  }'
```

**Request Body**
```json
{
  "name": "Juan Pérez García",
  "phone": "3001234567",
  "address": "Calle 123 #45-67, Apto 301",
  "countryId": 1,
  "departmentId": 1,
  "municipalityId": 1
}
```

**Response (200 OK)**
```json
{
  "message": "User created successfully"
}
```

**Response (400 Bad Request)**
```json
{
  "error": "Name is required"
}
```

---

## Casos de Uso

### Registro de Usuario en Colombia

```bash
# 1. Obtener países
curl http://localhost:5000/api/locations/countries

# 2. Seleccionar Colombia (id=1) y obtener departamentos
curl http://localhost:5000/api/locations/departments/1

# 3. Seleccionar Bogotá D.C. (id=1) y obtener municipios
curl http://localhost:5000/api/locations/municipalities/1

# 4. Crear usuario
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María González",
    "phone": "3109876543",
    "address": "Carrera 7 #32-16",
    "countryId": 1,
    "departmentId": 1,
    "municipalityId": 1
  }'
```

---

## Validaciones

### Nombre

```bash
# ❌ Nombre vacío
{"error": "Name is required"}

# ❌ Nombre muy corto
{"error": "Name must be at least 3 characters"}
```

### Teléfono

```bash
# ❌ Teléfono vacío
{"error": "Phone is required"}

# ❌ Teléfono inválido
{"error": "Invalid phone format"}
```

### Ubicación

```bash
# ❌ País inválido
{"error": "Country does not exist"}

# ❌ Departamento no pertenece al país
{"error": "Department does not belong to country"}

# ❌ Municipio no pertenece al departamento
{"error": "Municipality does not belong to department"}
```

---

## Testing con JavaScript/Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Obtener países
const countries = await api.get('/locations/countries');

// Crear usuario
const response = await api.post('/users', {
  name: 'Juan Pérez',
  phone: '3001234567',
  address: 'Calle 123 #45-67',
  countryId: 1,
  departmentId: 1,
  municipalityId: 1
});
```

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 400 | Validación fallida, datos inválidos |
| 404 | Recurso no encontrado |
| 500 | Error del servidor |
