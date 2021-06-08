FROM node:14-alpine3.13

LABEL "version"="0.1.0"
LABEL "repository"="https://github.com/VitraCash/keel-webhook-action"
LABEL "homepage"="https://github.com/VitraCash/keel-webhook-action"
LABEL "maintainer"="Koray Koska <koray@koska.at>"
LABEL "com.github.actions.name"="Keel Multi Webhook"
LABEL "com.github.actions.description"="Notify Keel about new container images."
LABEL "com.github.actions.icon"="message-square"
LABEL "com.github.actions.color"="gray-dark"


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["node", "/usr/src/app/main.js"]
