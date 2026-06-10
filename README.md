# Matt Snoby Resume

React/Vite resume site served by an unprivileged Nginx container.

## Local development

```bash
npm ci
npm run dev
```

## Production container

Build and start the site:

```bash
docker build -t matt-snoby-resume:latest .
docker run -d \
  --name matt-snoby-resume \
  --restart unless-stopped \
  --read-only \
  --security-opt no-new-privileges:true \
  --tmpfs /tmp \
  --tmpfs /var/cache/nginx \
  --tmpfs /var/run \
  -p 8080:8080 \
  matt-snoby-resume:latest
```

The site is available at <http://localhost:8080>. The container health endpoint is available at <http://localhost:8080/healthz>.

Stop the service:

```bash
docker stop matt-snoby-resume
docker rm matt-snoby-resume
```

The image uses a multi-stage build: Node.js compiles the Vite application, then an unprivileged Nginx runtime serves only the generated static files.
