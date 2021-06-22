FROM node:alpine as builder
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY . .

RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:alpine as runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nnc
RUN adduser -S nnc -u 1001

COPY --from=builder /app/package* ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nnc:nnc /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder --chown=nnc /app/recipes ./recipes
COPY --from=builder /app/next*.config.js ./

USER nnc

EXPOSE 3000
CMD ["npm", "start"]
