#!/bin/bash

# Script para inicializar el repositorio Git
# Uso: ./init-git.sh

echo "🚀 Inicializando repositorio Git..."
echo ""

# Verificar que .env existe
if [ ! -f .env ]; then
    echo "⚠️  No se encontró el archivo .env"
    echo "📝 Creando .env desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor, edita las contraseñas antes de continuar."
    echo ""
fi

# Inicializar git
git init
echo "✅ Repositorio Git inicializado"
echo ""

# Agregar todos los archivos
git add .
echo "✅ Archivos agregados al staging"
echo ""

# Mostrar estado
echo "📋 Estado actual:"
git status --short
echo ""

# Crear primer commit
echo "💾 Creando primer commit..."
git commit -m "Initial commit: Sistema de Registro de Usuarios - Coink"
echo ""

# Instrucciones para conectar con GitHub
echo "🎯 Siguiente paso: Conectar con tu repositorio remoto"
echo ""
echo "Ejecuta los siguientes comandos (reemplaza con tu URL):"
echo ""
echo "  git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
echo "✨ ¡Listo! Tu proyecto está preparado para subir a GitHub"
