# POVA Backend API app
This folder contains all the backend logic for the app, API app

## Installation
Clone the repository. make sure you have mongdb installed or instead use a Mongodb Atlas cluster

``$ cd pova-backend ``


install dependencies

``$ npm install``

create a `.env` file they contain environment varaibles required to run the app.
sample:

```
MONGODB_URI=mongodb://localhost:27017
PORT=5000
ACCESS_TOKEN_SECRET_KEY=your_secret_key
DATABASE=PovaDb
```

## Build
To build for production
run

``npm run build``
and to run for production
``npm run start-server``
or to run on development environment
``npm run start-devserver``
