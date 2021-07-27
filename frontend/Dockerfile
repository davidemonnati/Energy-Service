FROM node:14
WORKDIR frontend

COPY . /frontend
RUN npm install -g @angular/cli
# RUN cd /frontend
RUN npm install --save && ng build --prod
EXPOSE 8080
CMD [ "node", "server.js" ]
