# Lambdas

## Introduction

These are the lambda functions that are used by the serverless API.
They are written in Node.js and are intended to be run using the serverless framework.
The serverless framework is a tool that allows you to deploy and manage AWS Lambda functions,
API Gateway endpoints, and other AWS resources.  It is a powerful tool that allows you to create 
a serverless API with minimal effort.

The lambda functions are written using the `async` and `await` keywords.  This allows you to write
asynchronous code in a synchronous style.  This makes the code easier to read and understand.

That is not to say that you cannot use the .then() and .catch() methods.  You can.  However, the
`async` and `await` keywords are preferred. They are easier to read and understand.

## Directory Structure

- `armpit` - simple examples of lambda functions that returns static responses
- `auth` - contains the login and registration lambda functions
- `queues` - contains the lambda functions that are used to interact with the SQS queues (this includes both the dispatcher and handler functions)
- `users` - contains the lambda functions that are used to interact with the users in the system

## Running the Lambda Functions

The simplest way to test the lambda functions is to use the serverless-offline plugin. 
Start the serverless-offline plugin using the following command:

```bash
npm start
```

Then you can use a tool like Postman to send requests to the API.  The API will be available at `http://localhost:3000`.

An example endpoint would be `http://127.0.0.1:3000/dev/api/armpit`  

If we look in the serverless-functions.yml file, we can see that the `armpit` endpoint is defined as follows:

```yaml
armpit:
  handler: src/lambda/armpit/armpit.armpit
  events:
    - http:
        path: /api/armpit
        method: get
        cors: true
        authorizer: jwtAuthorizer
```

This means that the `armpit` endpoint is a `GET` request that is available at `http://localhost:3000/dev/api/armpit`.
It is also protected by the `jwtAuthorizer` authorizer.  So, an initial call the the login endpoint is required to get a token.
Then the token will be added to the `Authorization` header of the request. This will allow the request to be authenticated.

An example curl workflow would be:

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"foo","password":"123"}' \
  http://localhost:3000/dev/api/login
```

The response will look like:

```json
{
   "id":1,
   "username":"foo",
   "profilePic":"",
   "role":"ADMIN",
   "token":"eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJmb28iLCJwcm9maWxlUGljIjoiIiwicm9sZSI6IkFETUlOIiwidG9rZW4iOiIiLCJleHAiOjE3MDk1MDY2Mzl9.VM0-U9O99b7vmZBjmn0xNWGxQYM1kEJstArW2zqpy9c"
}
```
---
**NOTE**
The token is a JWT token.  It is signed using the `APP_SECRET` environment variable.
This means that the token is secure and cannot be tampered with.
It also means, you will need to fetch a new token every time you start the server.
The token will be valid for the duration of the `EXP` claim in the token. 
(currently 30 days - it will last for the whole time the local server is running for developing locally)
---

Then you can use the token to access the `armpit` endpoint:

```bash
curl \
  -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJmb28iLCJwcm9maWxlUGljIjoiIiwicm9sZSI6IkFETUlOIiwidG9rZW4iOiIiLCJleHAiOjE3MDk1MDY2Mzl9.VM0-U9O99b7vmZBjmn0xNWGxQYM1kEJstArW2zqpy9c" \
  http://localhost:3000/dev/api/armpit
```

The response will look like:

```
oxter
```
