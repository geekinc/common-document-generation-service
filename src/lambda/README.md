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
- `auth` - contains the lambda functions that are used to interact with the authentication system
- `health` - contains the lambda functions that are used to check the health of the system
- `login` - contains the login and registration lambda functions
- `queues` - contains the lambda functions that are used to interact with the SQS queues (this includes both the dispatcher and handler functions)
- `users` - contains the lambda functions that are used to interact with the users in the system

## Running the Lambda Functions

The simplest way to test the lambda functions is to use the serverless-offline plugin. 
Start the serverless-offline plugin using the following command:

```bash
npm start
```

Then you can use a tool like Postman to send requests to the API.  The API will be available at `http://localhost:3000`.

An example endpoint would be `http://127.0.0.1:3500/dev/api/armpit`  

If we look in the serverless-functions.yml file, we can see that the `armpit` endpoint is defined as follows:

```yaml
armpit:
  handler: src/lambda/armpit/armpit.armpit
  events:
    - http:
        path: /api/armpit
        method: get
        cors: true
        authorizer:
          name: combinedAuthorizer
          resultTtlInSeconds: ${self:custom.resultTtlInSeconds}
```

This means that the `armpit` endpoint is a `GET` request that is available at `http://localhost:3500/dev/api/armpit`.
It is also protected by the `combinedAuthorizer` authorizer.  So, an initial call the the login endpoint is required to get a token.
Then the token will be added to the `Authorization` header of the request. This will allow the request to be authenticated.

An example curl workflow would be:

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"foo","password":"456"}' \
  http://localhost:3500/dev/api/login
```

The response will look like:

```json
{
  "id": 1,
  "username": "foo",
  "role": "ADMIN",
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJrR3Jpc05XSnk1NlhGQWFKMFhabmJyOTV2QVZDUlBiT2hWV3NucEJKdWRJIn0.eyJleHAiOjE3MDcyNjE4OTMsImlhdCI6MTcwNzI2MTgzMywianRpIjoiZWU5YTg2OWQtMGI3MS00MTQxLTk0YjEtNzIyNWM0OWI2ZDY3IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOlsibWFzdGVyLXJlYWxtIiwiYWNjb3VudCJdLCJzdWIiOiI0OTUwMTdiNS1iMWQ2LTQxOWUtODI4ZS03ZWQ2YTkxYmZmMWQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsb2NhbC1jbGllbnQiLCJzZXNzaW9uX3N0YXRlIjoiZmU5NjVkMTAtMWI4Yy00ZWQzLTkwNmQtYTJkNDJlZDRiMDQ0IiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA5MCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJhcHBfdXNlciIsIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiIsImFwcF9hZG1pbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1hc3Rlci1yZWFsbSI6eyJyb2xlcyI6WyJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsInZpZXctcmVhbG0iLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJ2aWV3LWF1dGhvcml6YXRpb24iLCJxdWVyeS1jbGllbnRzIiwicXVlcnktdXNlcnMiLCJtYW5hZ2UtZXZlbnRzIiwibWFuYWdlLXJlYWxtIiwidmlldy1ldmVudHMiLCJ2aWV3LXVzZXJzIiwidmlldy1jbGllbnRzIiwibWFuYWdlLWF1dGhvcml6YXRpb24iLCJtYW5hZ2UtY2xpZW50cyIsInF1ZXJ5LWdyb3VwcyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInNpZCI6ImZlOTY1ZDEwLTFiOGMtNGVkMy05MDZkLWEyZDQyZWQ0YjA0NCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJmb28iLCJlbWFpbCI6ImZvb0BleGFtcGxlLmNvbSJ9.auuVTTquuuzssVZxJn7xquFr0I8Xry5h9OAmo1seneLgs4t_W-0Ri5IVKX3US7DdhCT3lttaGtbHLUzNrF80rmgsrZTNOXna6x9aMt7vcmgN6gjChbPEnYEbcCw_aDysKY30Uz6aJ1qwmXegyz5oDxioF6cX-AMsFyow3945-TaQYd0kOHr4eWgqvJwem0uGVZj9UF1CuivsP5i9ghTknjgN-yRM9zxuCwy8PfcRnCxzbRu0sLxKWtknwpMP-MfjAS8-zzn-dBRO8xnbuRgAPj3oeWjHQkr6qpQogozzVOCMg2-mEtk6rE3mnN36qOixwvgTi5B1i4w05pCCcY149w",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmMzY5ODU4MS1iZjRkLTRmNjEtOGY4ZS0yOGE3NDQyZGE3MGEifQ.eyJleHAiOjE3MDcyNjM2MzMsImlhdCI6MTcwNzI2MTgzMywianRpIjoiMzhlYjRkZmQtYjZlZi00NTY1LTg4NWQtMTIyMzc5MTY2ZmI0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL21hc3RlciIsInN1YiI6IjQ5NTAxN2I1LWIxZDYtNDE5ZS04MjhlLTdlZDZhOTFiZmYxZCIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJsb2NhbC1jbGllbnQiLCJzZXNzaW9uX3N0YXRlIjoiZmU5NjVkMTAtMWI4Yy00ZWQzLTkwNmQtYTJkNDJlZDRiMDQ0Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInNpZCI6ImZlOTY1ZDEwLTFiOGMtNGVkMy05MDZkLWEyZDQyZWQ0YjA0NCJ9.vWNP4Bxupg0l3WqLOylzsL7xhXP2mNOwcOUW6jIbATY"
}
```
These tokens are generated by KeyCloak and are used to authenticate the user.  The `token` is used to access the API.  
The `refreshToken` is used to get a new token when the old one expires.  The tokens are generated using the public/private key pair
that is configured on the KeyCloak realm.  The public key is used to verify the token and the private key is used to sign the token.
To access the public keys, make sure the KeyCloak server is running and then go to 
[http://localhost:8080/realms/master/protocol/openid-connect/certs](http://localhost:8080/realms/master/protocol/openid-connect/certs).


Then you can use the token to access the `armpit` endpoint:

```bash
curl \
  -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJmb28iLCJwcm9maWxlUGljIjoiIiwicm9sZSI6IkFETUlOIiwidG9rZW4iOiIiLCJleHAiOjE3MDk1MDY2Mzl9.VM0-U9O99b7vmZBjmn0xNWGxQYM1kEJstArW2zqpy9c" \
  http://localhost:3500/dev/api/armpit
```

The response will look like:

```
oxter
```

**NOTE:**

If you would like to test without a KeyCloak or OpenID Connect server, you can use the `login-jwt` endpoint.

The user is validated against a BCrypted password stored in the MySQL database. Once validated, the server
returns a JWT. This token is signed using the `APP_SECRET` environment variable.

This means that the token is secure and cannot be tampered with.
It also means, you will need to fetch a new token every time you start the server.
The token will be valid for the duration of the `EXP` claim in the token. 
(currently 30 days - it will last for the whole time the local server is running for developing locally)

