FROM node:alpine as builder 
WORKDIR /usr/app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf  /etc/nginx/conf.d/default.conf
COPY --from=builder  /usr/app/build  /usr/share/nginx/html