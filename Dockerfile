# build environment
FROM node:10-jessie as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
COPY . /usr/src/app
ARG BUILD_ENV
RUN npm run build:$BUILD_ENV

# staging environment
FROM nginx:1.15.0-alpine
RUN apk update
RUN apk upgrade
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html/web-app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]