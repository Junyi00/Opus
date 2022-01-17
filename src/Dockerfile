FROM ruby:3.0.3
RUN apt-get update -qq \
&& apt-get install -y curl build-essential libpq-dev \
 nodejs postgresql-client &&\
  curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get install -y nodejs yarn

COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN bundle install

# Install Dependencies
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

# Install source code
COPY . /app
WORKDIR /app

RUN bundle exec rake RAILS_ENV=production assets:precompile

COPY entrypoint_docker.sh /usr/bin/
ENTRYPOINT [ "entrypoint_docker.sh" ]

CMD ["rails", "server", "-b", "0.0.0.0"]