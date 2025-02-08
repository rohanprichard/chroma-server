FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
