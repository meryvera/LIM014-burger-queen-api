FROM node:10
WORKDIR /app
COPY . .
RUN npm ci --loglevel=error
EXPOSE 8080
