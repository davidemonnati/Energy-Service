FROM node:14
WORKDIR backend

COPY package*.json ./
COPY . .
RUN npm install --save && npm run tsc
EXPOSE 3008
CMD [ "node", "build/app.js" ]
