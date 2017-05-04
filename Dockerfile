FROM ubuntu:latest

# Install utilities
RUN apt-get update --fix-missing && apt-get -y upgrade &&\
  apt-get install -y sudo curl wget unzip git

# Install node 7
RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - &&\
  sudo apt-get install -y nodejs

# Install Chrome for Ubuntu
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - &&\
  sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' &&\
  sudo apt-get update &&\
  sudo apt-get install -y google-chrome-stable

# Set env vars
ENV SRC_DIR=/src OUT_DIR=/output
WORKDIR $SRC_DIR

# Install dependencies
RUN npm --global install yarn
COPY package.json $SRC_DIR
RUN yarn

COPY . $SRC_DIR

# Set the entrypoint
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
