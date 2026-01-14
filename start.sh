#!/bin/bash

echo "🚀 Iniciando Coink - Sistema de Registro de Usuarios"
echo "=================================================="
echo ""
echo "📦 Construyendo y levantando servicios..."
echo ""

# Detener contenedores existentes
docker compose down

# Construir y levantar servicios
docker compose up --build -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

echo ""
echo "✅ Sistema iniciado correctamente!"
echo ""
echo "📍 Servicios disponibles:"
echo "   - Frontend:  http://localhost:5173"
echo "   - API:       http://localhost:5000"
echo "   - PostgreSQL: localhost:5432"
echo ""
echo "📊 Ver logs:"
echo "   docker compose logs -f"
echo ""
echo "🛑 Detener servicios:"
echo "   docker compose down"
echo ""
