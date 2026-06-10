FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build
RUN find /app/dist -type f \( \
      -name '*.html' -o \
      -name '*.css' -o \
      -name '*.js' -o \
      -name '*.json' -o \
      -name '*.svg' -o \
      -name '*.txt' -o \
      -name '*.xml' \
    \) -exec sh -c 'gzip -9 -c "$1" > "$1.gz"' _ {} \;


FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/healthz || exit 1
