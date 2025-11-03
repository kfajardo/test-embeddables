# Multi-stage Dockerfile for Bison Payment Monorepo

FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/client/build /app/client/build
COPY --from=build-env /app/server/build /app/server/build
WORKDIR /app
# Update CMD based on which service you want to run
# For client:
CMD ["npm", "run", "start:client"]
# For server (uncomment when backend is integrated):
# CMD ["npm", "run", "start:server"]