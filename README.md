# README

## Overview

This demo shows how to use Docker Compose with nginx and Vite HMR.

The trick is to set the hmr.clientPort to a separate port that is configured in `nginx/default.conf`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://backend:5174',
    },
    hmr: {
      clientPort: 81,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
})
```

Additionally, in `nginx/default.conf` the connection needs to be upgraded in order to accept web sockets.

```nginx
server {
    listen 81;

    location / {
        proxy_pass http://frontend:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}

server {
    listen 80;

    location / {
        proxy_pass http://frontend:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

And finally in the docker-compose.yml file, expose both ports 80, and 81.

```yaml
nginx:
  image: nginx:latest
  container_name: nginx
  ports:
    - '80:80'
    - '81:81'
  volumes:
    - ./nginx:/etc/nginx/conf.d
  depends_on:
    - frontend
    - backend
```
