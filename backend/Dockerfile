FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16 AS server
WORKDIR /app
COPY package* ./
RUN npm install --production
COPY --from=builder ./src/app/node_modules ./node_modules
COPY --from=builder ./src/app/dist ./dist
EXPOSE 8080
CMD ["npm", "start"]