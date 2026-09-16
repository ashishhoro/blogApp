FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

# ENTRYPOINT [ "node" "app.js" ]# ✅ Shell form with explicit shell
ENTRYPOINT ["/bin/sh", "-c", "node app.js"]
# CMD [ "node" "app.js" ]