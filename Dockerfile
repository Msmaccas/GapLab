FROM node:18-alpine AS build
WORKDIR /app
COPY . .
# Install dependencies using the lockfile.  The package-lock.json is
# generated via `npm install --package-lock-only` prior to build.
RUN npm ci
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]