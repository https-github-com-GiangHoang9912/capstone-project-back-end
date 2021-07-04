FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app/backend
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && npm install -g @nestjs/cli && mv node_modules ../
COPY .env.example .env
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
