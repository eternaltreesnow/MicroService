FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/teammanage
WORKDIR /usr/src/teammanage

# Install app dependencies
COPY package.json /usr/src/teammanage/
RUN npm install

# Bundle app source
COPY . /usr/src/teammanage

# Bind port
EXPOSE 10004

# Define command
CMD [ "npm", "start" ]
