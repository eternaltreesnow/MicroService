FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/authlogin
WORKDIR /usr/src/authlogin

# Install app dependencies
COPY package.json /usr/src/authlogin/
RUN npm install

# Bundle app source
COPY . /usr/src/authlogin

# Bind port
EXPOSE 10001

# Define command
CMD [ "npm", "start" ]
