# syntax=docker/dockerfile:1

FROM ghcr.io/gohugoio/hugo:v0.163.2 AS builder
USER root
WORKDIR /src
COPY . .
RUN hugo --minify --gc

FROM caddy:2-alpine
COPY --from=builder /src/public /site
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
