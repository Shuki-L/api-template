# Stage 1 - build
FROM node:8.15.1-alpine as build

# Create app directory
WORKDIR /vpccc-api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

# Copy all root user files to destination workdir
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install && \
    npm run build && \
    rm -R ./src 

# If you are building your code for production
# RUN npm install --only=production

# Stage 2
FROM node:8.15.1-alpine

WORKDIR /vpccc-api

COPY --from=build /vpccc-api /vpccc-api

CMD ["npm", "start"]

EXPOSE 8123