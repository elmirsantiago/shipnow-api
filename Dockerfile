
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --no-audit --no-fund

COPY --chown=node:node src ./src

RUN mkdir -p /app/uploads && \
    chown -R node:node /app/uploads

USER node

EXPOSE 8080

CMD ["node", "src/server.js"]
