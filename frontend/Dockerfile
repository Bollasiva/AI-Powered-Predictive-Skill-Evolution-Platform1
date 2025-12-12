# frontend/Dockerfile

FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start React on 0.0.0.0 so other machines & Docker can access it
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
