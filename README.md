# Apollo-Search

## Description

This project is a platform to allow users to search for prospects and view their information. The project is built using React and Apollo.io 
As such, there are two sides to the application

1) The front end, which is built using React
2) The back end, which is built using Serverless and Apollo.io

The data is stored in a Postgres database, and the back end is deployed using AWS Lambda functions. The front end is deployed using AWS Amplify.

## Getting Started

When starting this application, you will need to start the front end and the back end separately.

The node modules require for the app need to be added. To do this, run the following command in the root directory of the project:

```npm install```

Then, go to the `server` directory and run the following command:

```npm install```

## Starting the Front End

To start the front end, run the following command in the root directory of the project:

```npm run local```

This will start the application on the localhost on port 3001

## Starting the Back End

To start the back end, run the following command in the `server` directory:

```serverless offline```

This will start the back end on the localhost on port 3000
