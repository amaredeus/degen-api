FROM node:16-buster-slim

WORKDIR /app

RUN apt update
RUN apt install dumb-init

# Copy config files
COPY package.json package.json
COPY package-lock.json package-lock.json

# Copy build files
COPY ./dist/apps/degen-api .

ENV NODE_ENV=production
ENV API_NEST_PORT=8080
EXPOSE 8080

RUN npm ci --only=production --ignore-scripts --platform=linux

CMD ["dumb-init", "node", "main.js"]
