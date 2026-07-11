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

## Build commands

Build the website:

```bash
npm run build
```

Build the resume HTML and PDF artifacts:

```bash
npm run build:resume
```

Build both the website and resume artifacts together:

```bash
npm run build:all
```

## Production container

Build and start the site:

```bash
./build.sh
docker run -d \
  --name matt-snoby-resume \
  --restart unless-stopped \
  --read-only \
  --security-opt no-new-privileges:true \
  --tmpfs /tmp \
  --tmpfs /var/cache/nginx \
  --tmpfs /var/run \
  -p 8080:8080 \
  iotapi322/resume:latest
```

Override the image tag if needed:

```bash
IMAGE_TAG=dev ./build.sh
```

`./build.sh` follows the same local sequence as `.drone.yml`: `npm ci --no-audit --no-fund`, `npm run lint`, `npm run build`, then `docker build`.

It also verifies that the static resume download assets exist in `public/` before building the container, so the reverse-proxied site will serve:

```text
/Matthew-Snoby-Resume.pdf
/Matthew-Snoby-Resume.docx
/Matthew-Snoby-Resume-SRE.html
/Matthew-Snoby-Resume-SRE.pdf
```

The site is available at <http://localhost:8080>. The container health endpoint is available at <http://localhost:8080/healthz>.

Stop the service:

```bash
docker stop matt-snoby-resume
docker rm matt-snoby-resume
```

The image uses a multi-stage build: Node.js compiles the Vite application, then an unprivileged Nginx runtime serves only the generated static files.

The runtime serves versioned assets with long-lived caching and uses precompressed gzip files for HTML, CSS, JavaScript, and SVG responses.
