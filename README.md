# Opus - Task Management Platform

Opus is a task management web application created with React JS, Ruby on Rails & PostgreSQL

## Features

- User Authentication 
- Customisable project workflow through lanes
- Track projects & tasks progress (due dates etc...)
- More to come...

## Technologies

|              | Version |
|:------------:|:-------:|
|   React JS   |   17.0  |
|    Rails     |  6.1.4  |
|  PostreSQL   |   13.3  |
|    Nginx     |   1.21  |

Others:

- Redux (4.1) & redux-thunk (2.4) 
- react-dnd (14.0)

## Setup  

### **Deploying with Docker**

1. Install [Docker](https://www.docker.com/)
2. Clone this repository
3. Build the necessary images
    ```
    docker-compose build
    ```
4. Run Opus
    ```
    docker-compose up -d
    ```

### **Deploying on Heroku**

1. Create Project in Heroku (Take note of your app name!)
2. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Add _nodejs_ and _ruby_ buildpacks 
    ```
    heroku buildpacks:add --index 2 heroku/ruby -a <APP_NAME>
    ```
4. Clone this repository
5. Initialise Heroku git remote
    ```
    heroku git:remote -a <APP_NAME>
    ```
6. Push to heroku remote   
  Use _main_ branch for a more stable build
    ```
    git push heroku main
    ```
    OR
    ```
    git push heroku dev:main 
    ```
7. Setup your database
    ```
    heroku run rake db:migrate -a <APP_NAME>
    ```
8. Done! Heroku should have Opus up and running by now 

### Setting up an email for Opus (OPTIONAL)

Resetting password requires Opus proper access to an email to send our verification link

_GMail - Google_
1. Create an account
2. Setup 2-factor authentication
3. Create an [App Password](https://support.google.com/accounts/answer/185833?hl=en) for the gmail account
4. Setting email configruation for Opus to use
    ```
    heroku config:set MAILER_EMAIL=<GMAIL_EMAIL> MAILER_USERNAME=<GMAIL_USERNAME> MAILER_PASSWORD=<APP_PASSWORD>
    ```
    OR
    Append the following lines to .docker_env
    ```
    MAILER_EMAIL=<GMAIL_EMAIL>
    MAILER_USERNAME=<GMAIL_USERNAME> 
    MAILER_PASSWORD=<APP_PASSWORD>
    ```
5. Restart your heroku instance

## Roadmap 

- Varying levels of task priorities
- Project Collaboration
