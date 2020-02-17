FROM node:8
RUN mkdir /code

WORKDIR /
ADD package.json yarn.lock /
RUN yarn install
ENV PATH /node_modules/.bin:$PATH
WORKDIR /code/
ADD . /code/

RUN yarn build
CMD yarn start
