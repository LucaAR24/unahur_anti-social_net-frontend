# UnaHur - Red Anti-Social - 2026 - C1 Interfaces de Usuario

Este proyecto es una aplicación web estilo red social desarrollada con **React + TypeScript** en el frontend y **Node.js + Express + MongoDB** en el backend.  
Permite a los usuarios registrarse, crear publicaciones con título, contenido, etiquetas y asociar imágenes, además de comentar en publicaciones.

---

## Funcionalidades principales

- Registro e inicio de sesión de usuarios.
- Creación de publicaciones con:
  - Título y contenido.
  - Etiquetas (tags).
  - Imágenes asociadas.
- Comentarios en publicaciones con referencia al autor.
- Listado de publicaciones por usuario.
- API documentada con Swagger.
- Backend con soporte de **Docker** y **MongoDB**.

---

## Requerimientos previos

Antes de instalar y correr el proyecto, asegurate de tener:

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
- MongoDB (se puede correr en contenedor con Docker)

---

## Instalación del backend

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/EP-UnaHur-2026C1/anti-social-documental-tp-24
   ```
   
2. Abrir con Visual la api:
   ```bash
   code .
   ```

3. Seleccionar la carpeta del Backend:
    ```bash
   cd anti-social-documental-tp-24/
   ```

4. Instalar las dependencias utilizando la consola de Visual (Ctrl + J):
   ```bash
   npm i
   ```

5. Levantar Docker Compose:
   ```bash
   docker-compose up -d
   ```

6. Verificar que el backend esté corriendo en:
   ```bash
   https://localhost:5000
   ```
   
7. Pueden fallar las primeras veces en la creación de la base de datos, en caso de que esto ocurra:
   ```bash
   docker-compose down
   ```
   y vuelva al paso 5.

   Si es repetitivo este paso, es posible revisar con:
   ```bash
   docker-compose ps
   ```
   Para comprobar qué servicios faltan. Los que deberían aparecer son: mongo:lastest, mongo:express, redis:lastest, anti-social-documental-tp-24-api. Si alguno de estos falta, vuelva al paso 5.

# Instalación del frontend

1. Clonar este repo:
   ```bash
   https://github.com/LucaAR24/unahur_anti-social_net-frontend
   ```

2. Ir al directorio del frontend (ya sea desde bash o la carpeta misma):
   ```bash
   cd unahur_anti-social_net-frontend/
   ```

3. Abrir el proyecto en Visual:
   ```bash
   code .
   ```

4. Instalar dependencias desde la consola de Visual:
   ```bash
   npm i
   ```

5. Levantar la página:
   ```bash
   npm run dev
   ```

6. Abrir la página en el navegador:
   ```bash
   http://localhost:5173
   ```

# Documentación API
La API está documentada con **Swagger**.
Accedé a la documentación en: **http://localhost:5000/api-docs**

# Desarrollador
Luca – Desarrollo frontend y backend
