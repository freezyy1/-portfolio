# этап сборки
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# этап выполнения
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/views ./views
COPY --from=build /app/public ./public
COPY --from=build /app/.env.example ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
