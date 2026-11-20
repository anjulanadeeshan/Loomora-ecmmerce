FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4000

USER node

EXPOSE 4000

CMD ["npm", "start"]
