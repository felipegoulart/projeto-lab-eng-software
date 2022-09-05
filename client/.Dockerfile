#develop stage
FROM node:16-alpine as develop-stage
WORKDIR /src
COPY package*.json ./
RUN npm i -g @quasar/cli@latest
COPY . .

#local stage
FROM develop_stage as local-stage
RUN npm

#build stage (spa)
FROM local-stage as build-stage-spa
RUN quasar build -m spa

#production stage (spa)
FROM nginx:stable-alpine as production-stage-spa
COPY --from=build-stage-spa /src/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "deamon off;"]
