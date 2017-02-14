FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/usermanage
WORKDIR /usr/src/usermanage

# Install app dependencies
COPY package.json /usr/src/usermanage/
RUN npm install

# Bundle app source
COPY . /usr/src/usermanage

# Bind port
EXPOSE 10003

# Define command
CMD [ "npm", "start" ]
