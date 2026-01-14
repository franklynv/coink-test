# 🚀 Guía de Despliegue

## Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Git (para clonar el repositorio)
- Puertos disponibles: 5000, 5173, 5432

> **Nota:** Este proyecto fue desarrollado en macOS pero funciona en cualquier sistema operativo con Docker instalado.

---

## Instalación Rápida

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd coink-test
```

### 2. Configurar variables de entorno

Crea el archivo `.env` a partir de la plantilla:

**macOS/Linux:**
```bash
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Windows (CMD):**
```cmd
copy .env.example .env
```

Edita el archivo `.env` y configura las contraseñas:

```env
POSTGRES_DB=coinkdb
POSTGRES_USER=coink
POSTGRES_PASSWORD=tu_contraseña_segura_aquí

DB_HOST=postgres
DB_PORT=5432
DB_NAME=coinkdb
DB_USER=coink
DB_PASSWORD=tu_contraseña_segura_aquí

API_PORT=5000
FRONT_PORT=5173
```

> **Importante:** El archivo `.env` no se sube al repositorio por seguridad. Cada desarrollador debe crear el suyo.

### 3. Levantar el sistema

#### macOS/Linux - Script automatizado

```bash
chmod +x start.sh
./start.sh
```

#### Windows o Docker Compose directo

```bash
docker compose up --build
```

#### Modo detached (background)

```bash
docker compose up --build -d
```

---

## Verificación del Despliegue

### 1. Verificar que los contenedores estén corriendo

```bash
docker ps
```

Deberías ver 3 contenedores:
- `coink-postgres`
- `coink-api`
- `coink-front`

### 2. Verificar logs

```bash
# Ver todos los logs
docker compose logs

# Ver logs de un servicio específico
docker compose logs api
docker compose logs front
docker compose logs postgres

# Seguir logs en tiempo real
docker compose logs -f
```

### 3. Probar los servicios

#### Frontend
```
http://localhost:5173
```

#### API - Health Check
```bash
curl http://localhost:5000/api/locations/countries
```

#### Base de Datos
```bash
docker exec -it coink-postgres psql -U coink -d coinkdb -c "SELECT * FROM country;"
```

---

## Comandos Útiles

### Detener servicios

```bash
docker compose down
```

### Detener y eliminar volúmenes (resetear BD)

```bash
docker compose down -v
```

### Reconstruir un servicio específico

```bash
docker compose up --build api
docker compose up --build front
```

### Ver logs de un contenedor

```bash
docker logs coink-api
docker logs coink-front
docker logs coink-postgres
```

### Acceder a un contenedor

```bash
# API
docker exec -it coink-api /bin/bash

# PostgreSQL
docker exec -it coink-postgres psql -U coink -d coinkdb

# Frontend
docker exec -it coink-front /bin/sh
```

---

## Solución de Problemas

### Error: Puerto ya en uso

Si algún puerto está ocupado, puedes cambiarlos en `.env`:

```env
API_PORT=5001  # Cambiar a otro puerto disponible
FRONT_PORT=5174
```

O directamente en `docker-compose.yml`:

```yaml
ports:
  - "5001:8080"  # Cambiar el puerto externo
```

### Error: No se puede conectar a la base de datos

1. Verificar que PostgreSQL esté corriendo:
```bash
docker ps | grep postgres
```

2. Verificar logs de PostgreSQL:
```bash
docker logs coink-postgres
```

3. Esperar unos segundos más (la BD tarda en inicializar)

### Error: Frontend no carga

1. Verificar que el contenedor esté corriendo:
```bash
docker ps | grep front
```

2. Verificar logs:
```bash
docker logs coink-front
```

3. Verificar que la API esté respondiendo:
```bash
curl http://localhost:5000/api/locations/countries
```

### Limpiar todo y empezar de cero

```bash
# Detener y eliminar todo
docker compose down -v

# Eliminar imágenes
docker rmi coink-test-api coink-test-front

# Reconstruir
docker compose up --build
```

---

## Pruebas Manuales

### 1. Probar API con curl

#### Listar países
```bash
curl http://localhost:5000/api/locations/countries
```

#### Listar departamentos de Colombia (id=1)
```bash
curl http://localhost:5000/api/locations/departments/1
```

#### Listar municipios de Bogotá (id=1)
```bash
curl http://localhost:5000/api/locations/municipalities/1
```

#### Crear usuario
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "phone": "3001234567",
    "address": "Calle 123 #45-67",
    "countryId": 1,
    "departmentId": 1,
    "municipalityId": 1
  }'
```

### 2. Probar desde el Frontend

1. Abrir http://localhost:5173
2. Llenar el formulario
3. Seleccionar país, departamento y municipio
4. Hacer clic en "Registrar Usuario"
5. Verificar mensaje de éxito

---

## Despliegue en Producción

### Variables de Entorno

Para producción, actualizar `.env` con valores seguros:

```env
POSTGRES_PASSWORD=contraseña_muy_segura_y_compleja
DB_PASSWORD=contraseña_muy_segura_y_compleja
```

> **Nunca subas el archivo `.env` al repositorio.** Usa variables de entorno del servidor o servicios de secrets management.

### HTTPS

Para producción, configura un reverse proxy (Nginx/Traefik) con certificados SSL.

### Escalabilidad

Para escalar la API:

```bash
docker compose up --scale api=3
```

---

## Monitoreo

### Ver uso de recursos

```bash
docker stats
```

### Ver espacio en disco

```bash
docker system df
```

### Limpiar recursos no utilizados

```bash
docker system prune -a
```

---

## Respaldo de Base de Datos

### Crear backup

```bash
docker exec coink-postgres pg_dump -U coink coinkdb > backup.sql
```

### Restaurar backup

```bash
cat backup.sql | docker exec -i coink-postgres psql -U coink -d coinkdb
```

---

## Notas Adicionales

### Diferencias entre Sistemas Operativos

- **macOS/Linux:** Pueden usar el script `start.sh` para iniciar todo automáticamente
- **Windows:** Usar `docker compose up --build` directamente (el script `.sh` no es compatible)
- **Permisos:** En macOS/Linux puede ser necesario usar `chmod +x start.sh`

### Troubleshooting en Windows

Si tienes problemas con Docker en Windows:

1. Asegúrate de que Docker Desktop esté ejecutándose
2. Verifica que WSL 2 esté habilitado (para Windows 10/11)
3. Revisa que los puertos no estén bloqueados por el firewall

---

## Contacto y Soporte

Para cualquier problema o pregunta sobre el despliegue, contactar al desarrollador.

**Franklyn Villasmil**  
Desarrollador Backend / Fullstack
