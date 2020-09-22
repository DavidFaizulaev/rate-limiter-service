FROM node:12-alpine

# Create the app folder
RUN mkdir -p /src/app
WORKDIR /src/

# Copy working files
COPY package.json /src/
COPY package-lock.json /src/
RUN npm install --only=production

# Copy package.json
COPY src /src/app/
COPY config /src/config
COPY docs /src/docs

# Create an app user so our program doesn't run as root.
RUN addgroup -S app && adduser -S -G app -h /home/app -D app
RUN chown -R app /src
USER app

# Run the js script
ENTRYPOINT ["node", "--max_old_space_size=256", "./app/server.js"]

