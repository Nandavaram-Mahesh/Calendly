FROM node:alpine as base


# Stage 1: Builder Stage

FROM base as builder

WORKDIR /development/calendly/backend

COPY package*.json .

COPY tsconfig.json .

COPY prisma.config.ts .

RUN npm install

COPY src/ ./src/

COPY prisma/ ./prisma/

COPY generated/ ./generated/

RUN npm run build


# Stage 2: Runner Stage
FROM base as runner

WORKDIR calendly/backend

COPY --from=builder /development/calendly/backend/dist ./dist

COPY --from=builder /development/calendly/backend/package*.json  .

COPY --from=builder /development/calendly/backend/.env .

RUN npm install --omit=dev

CMD ["npm", "run", "start"]




# docker run -it --env-file .env  -p 8000:3000 --rm calendly-multi-stage

# We don't add the env variables into the docker image , we just inject them into the container


