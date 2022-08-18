# Prerequisites before running this codebase

## Install AllegroGraph

### Install Docker

Use Docker to run the prebuilt image. Follow instructions based on your OS here: https://docs.docker.com/get-docker/

### Pull AllegroGraph image

Detailed instructions -> https://franz.com/agraph/support/documentation/current/docker.html

Use the latest image for AllegroGraph with

> docker pull franzinc/agraph

Start the container with

> docker run -d -e AGRAPH_SUPER_USER=test -e AGRAPH_SUPER_PASSWORD=xyzzy -p 10000-10035:10000-10035 --shm-size 1g --name agraph --restart=always franzinc/agraph

### Allow anonymous access on AllegroGraph

Log into AllegroGraph web console on port 10035. If running locally, go to http://localhost:10035. Login credentials are in docker command above: username: test and password: xyzzy

Go to Admin > Users > `add a user`

Only add anoynmous as Username and click OK

After creating user, click on `edit` under anoynmous > Select `Grant read/write on catalog * repository *` > Click ok

Create 'marauder-test' and 'marauder-knowledge' repositories from the home page of AllegroGraph

## Get Diffbot key

Go to https://www.diffbot.com/ and sign up with your Organisation ID to get a free trial

After logging in, copy `API Token` in top right corner. Use that as value for variable `TOKEN` in `add_facts` method in \Backend\main.py

## Clone the repository

git clone/download ZIP

## Run the Frontend

Go to directory boiler-plate-CRUD

Run `npm install`

Run `npm start`

## Run the Backend

Go to directory Backend

Run `pip install requirements.txt`

Run `python main.py`
