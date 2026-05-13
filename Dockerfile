FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY index.html styles.css app.js server.js ./

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV MATHBRIDGE_DATA_DIR=/data
ENV MATHBRIDGE_SECURE_COOKIES=1

RUN mkdir -p /data

VOLUME ["/data"]
EXPOSE 8080

CMD ["npm", "start"]
