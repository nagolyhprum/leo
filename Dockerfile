FROM node:12
RUN apt-get update -y
RUN apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev
WORKDIR /home/node
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm i --build-from-source
COPY . .
CMD npm run dev