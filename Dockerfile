# Base image
FROM node:18-alpine
# Create app directory
WORKDIR /usr/src/app

# Install nestjs
RUN npm i -g @nestjs/cli

# Start the server using the production build
USER node
CMD [ "npm", "run", "start:dev" ]