# UThub en Netlify + Render + Alwaysdata

## Arquitectura
- `Netlify` hospeda la página web estática.
- `Render` hospeda el backend en Node.js.
- `Alwaysdata` hospeda la base de datos MySQL.

## Lo que hay que cambiar
1. En `js/config.js`, cambia la URL del backend por la URL real de Render.
2. En Render, define `DATABASE_URL` o las variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_SSL`.
3. En Render, define `JWT_SECRET`, `PUBLIC_URL` y `ALLOWED_ORIGINS`.
4. En Netlify, publica la carpeta raíz del frontend.

## Subir a Render
1. Crea un Web Service.
2. Selecciona este proyecto y usa la carpeta `backend` como raíz.
3. Build command: `npm install`
4. Start command: `npm start`
5. Agrega las variables de entorno.

## Subir a Netlify
1. Crea un nuevo site from Git o drag and drop.
2. Sube la carpeta raíz del frontend.
3. Netlify debe publicar desde la raíz `.`.

## Base de datos
1. Importa `backend/database.sql` en tu base MySQL de Alwaysdata.
2. Usa el host `mysql-uthub.alwaysdata.net`.
3. Verifica que existan las tablas `usuarios`, `tiendas`, `productos`, `pedidos` y `detalle_pedido`.

## Dato importante
- El backend gratis de Render puede dormir cuando no recibe tráfico.
- La página en Netlify seguirá activa todo el tiempo.
- Alwaysdata queda solo como proveedor MySQL, no como host principal del sitio.
