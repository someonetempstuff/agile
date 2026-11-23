FROM node:22-alpine
WORKDIR /app
COPY --chown=1001:0 src ./src
ENV NODE_ENV=production PORT=8000
EXPOSE 8000
USER 1001
CMD ["node", "src/server.js"]
