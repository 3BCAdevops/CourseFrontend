# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build

# 👇 IMPORTANT
ENV PORT=80
EXPOSE 80

CMD ["sh", "-c", "serve -s build -l 80"]
