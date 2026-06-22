# Matt Snoby Resume

React/Vite resume site served by an unprivileged Nginx container.

Drone CI validates linting and the production build, then publishes `iotapi322/resume` with incrementing auto-tags such as `build-42` on `main` and `1.2.3-build-42` for a semantic Git tag. Pull requests build the container without publishing it.

## Local development

```bash
npm ci
npm run dev
```

To test the resume chatbot against the FastAPI backend running at `http://10.0.0.85:8000`:

```bash
npm run dev:local-api
```

That starts Vite with the resume API base URL already pointed at your backend.

To build and run the Docker version locally against the same backend:

```bash
./scripts/run-local-docker.sh
```

Optional overrides:

```bash
API_BASE_URL=http://10.0.0.85:8000 HOST_PORT=8081 ./scripts/run-local-docker.sh
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

The runtime serves versioned assets with long-lived caching and uses precompressed gzip files for HTML, CSS, JavaScript, and SVG responses.
