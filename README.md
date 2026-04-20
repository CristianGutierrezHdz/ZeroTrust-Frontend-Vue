## ZeroTrust Frontend Vue

Frontend en Vue 3 + Vite con vista de peliculas que consume datos por una ruta puente local (`/bridge`) para no exponer directamente la API privada al cliente.

## Flujo de red en produccion

1. El navegador llama a `/bridge/listar/peliculas?...`.
2. Apache2 recibe esa ruta y la proxyea a la red privada: `http://10.1.1.115/api/listar/peliculas?...`.
3. Apache2 devuelve JSON al frontend.

Si `/bridge` no esta configurado, la SPA fallback devuelve `index.html` y en el navegador aparece:

`Unexpected token '<', "<!DOCTYPE ..." is not valid JSON`

## Build del proyecto

```bash
npm install
npm run build
```

Publicar el contenido de `dist` en:

`/var/www/ZeroTrust-Frontend-Vue/dist`

## Apache2 en produccion (HTTPS)

### 1) Habilitar modulos necesarios

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod headers
```

### 2) Configurar VirtualHost

Usar este bloque en tu sitio SSL:

```apache
<IfModule mod_ssl.c>
		<VirtualHost *:443>
				ServerName cedrick.click
				ServerAlias www.cedrick.click

				DocumentRoot /var/www/ZeroTrust-Frontend-Vue/dist

				<Directory /var/www/ZeroTrust-Frontend-Vue/dist>
						Options Indexes FollowSymLinks
						AllowOverride None
						Require all granted
				</Directory>

				ProxyPreserveHost On
				RequestHeader set X-Forwarded-Proto "https"

				# API directa (si aun la usas)
				ProxyPass        /api/     http://10.1.1.115/api/
				ProxyPassReverse /api/     http://10.1.1.115/api/

				# Puente que usa el frontend
				ProxyPass        /bridge/  http://10.1.1.115/api/
				ProxyPassReverse /bridge/  http://10.1.1.115/api/

				RewriteEngine On

				# Evita reescribir llamadas de backend
				RewriteCond %{REQUEST_URI} !^/api/
				RewriteCond %{REQUEST_URI} !^/bridge/

				# Evita reescribir archivos estaticos
				RewriteCond %{REQUEST_URI} !\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map)$

				# SPA fallback (Vue)
				RewriteRule ^ /index.html [L]

				Include /etc/letsencrypt/options-ssl-apache.conf
				SSLCertificateFile /etc/letsencrypt/live/cedrick.click/fullchain.pem
				SSLCertificateKeyFile /etc/letsencrypt/live/cedrick.click/privkey.pem
		</VirtualHost>
</IfModule>
```

### 3) Validar y recargar Apache

```bash
sudo apachectl configtest
sudo systemctl reload apache2
```

