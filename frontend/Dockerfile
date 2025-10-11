# # Build stage
# FROM node:16.20.2-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# ENV NODE_OPTIONS=--openssl-legacy-provider
# RUN npm run build

# # Production stage
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# 
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV GENERATE_SOURCEMAP=false
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build

# Serve the static files
ENV PORT=3000
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]

# Build stage
# FROM node:18-alpine AS build

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy source code
# COPY . .

# ENV PORT=3000

# EXPOSE $PORT

# # Build the app with the correct public URL
# RUN PUBLIC_URL=/FableSmithStudio_Website npm run build

# CMD ["npm", "start"]

# # # Production stage
# # FROM nginx:stable-alpine

# # # Remove default nginx static assets
# # RUN rm -rf /usr/share/nginx/html/*

# # # Copy built assets from build stage
# # COPY --from=build /app/build /usr/share/nginx/html

# # # Copy custom nginx config
# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# # # Start Nginx
# # CMD ["nginx", "-g", "daemon off;"]
