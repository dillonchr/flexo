FROM mhart/alpine-node:10.7
RUN apk add --no-cache tzdata
ENV TZ America/Chicago
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /code/
COPY package*.json ./
RUN npm i
COPY . .
CMD ["npm", "start"]

