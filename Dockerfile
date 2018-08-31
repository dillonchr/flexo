FROM mhart/alpine-node:10.7
WORKDIR /code/
COPY package*.json ./
RUN npm i
COPY . .
CMD ["npm", "start"]

