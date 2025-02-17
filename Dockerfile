FROM node:18-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Add package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 