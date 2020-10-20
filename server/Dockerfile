FROM node:10.15.3-stretch
# args
ARG BUILD_DATE
ARG PHR_VERSION
ARG APP_RELEASE
ARG APP_ENV
# Lables
LABEL maintainer="info@mindwaveventures.com"
LABEL name="Liverpool"
LABEL servicename="Liverpool"
LABEL description="Liverpool service"
LABEL version=$PHR_VERSION
LABEL vcs-url="https://github.com/mindwaveventures/Liverpool-CAMHS.git"
LABEL build-date=$BUILD_DATE
LABEL release=$APP_RELEASE
LABEL environment=$APP_ENV
LABEL tier="backend"
LABEL company="Mindwave Ventures LTD"
RUN echo environment $APP_ENV
WORKDIR /app
ADD . .
RUN npm install
CMD npm install pg --save
EXPOSE 3001
# WORKDIR /app
ENTRYPOINT ["npm", "start"]