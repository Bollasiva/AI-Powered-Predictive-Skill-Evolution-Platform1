# frontend/Dockerfile

FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package.json ./
# Delete package-lock.json if it was accidentally copied (though the above line prevents it)
# and force fresh install
RUN npm install

# Copy app source
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start React on 0.0.0.0 so other machines & Docker can access it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
