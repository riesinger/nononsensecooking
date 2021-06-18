FROM node:alpine as builder
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:alpine as runner

ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/package* /app/
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/recipes /app/recipes
COPY --from=builder /app/next.config.js /app/next.config.js
COPY --from=builder /app/next-i18next.config.js /app/next-i18next.config.js

EXPOSE 3000
CMD ["npm", "start"]
