# UThub en Netlify + Render

## Arquitectura
- `Netlify` hospeda la página web estática.
- `Render` hospeda el backend en Node.js.
- `MySQL` vive en un proveedor aparte o en el servicio MySQL que elijas.

## Lo que hay que cambiar
1. En Render, define `DATABASE_URL`, `JWT_SECRET`, `PUBLIC_URL` y `ALLOWED_ORIGINS`.
2. En `js/config.js`, cambia `https://TU-BACKEND.onrender.com/api` por la URL real de tu backend.
3. En `backend/.env.example`, usa tus valores reales en el entorno de Render.

## Subir a Render
1. Crea un Web Service.
2. Selecciona este proyecto y usa la carpeta `backend` como raíz.
3. Build command: `npm install`
4. Start command: `npm start`
5. Agrega las variables de entorno.

## Subir a Netlify
1. Crea un nuevo site from Git o drag and drop.
2. Sube la carpeta raíz del proyecto.
3. Netlify debe publicar desde la raíz `.`.
4. No necesitas backend en Netlify, solo la interfaz.

## Base de datos
1. Importa `backend/database.sql` en tu proveedor MySQL.
2. Verifica que existan las tablas `usuarios`, `tiendas`, `productos`, `pedidos` y `detalle_pedido`.

## Dato importante
- Si tu backend está en Render gratis, puede dormir cuando no recibe tráfico.
- La página en Netlify seguirá activa todo el tiempo; el backend tardará unos segundos en despertar cuando entren peticiones.
