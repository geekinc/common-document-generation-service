# Common Document Generation Service <br>(Serverless Framework)

This is a flexible serverless API to generate documents based on data and templates. It is built using the Serverless Framework.

## Getting Started

### OpenAPI Specification

The API is documented using the OpenAPI Specification.  You can find the specification in the [./docs/api/openapi.json](./docs/api/openapi.json) file.

The current version can be viewed directly here: [CDGS (v1.0.0) OpenAPI Viewer](https://app.swaggerhub.com/apis/geekinc/CDGS/v1.0.0)

### Prerequisites

Quick install for Geek team: `asdf local nodejs 18.16.1`

* Node.js (>= v18.16.1)
* NPM (>= 8.3.0)
* Docker (>= 25.0.2)
* AWS CLI (>= 2.2.4)

In addition to these prerequisites, you will need to have the Serverless Framework installed.
This will give you access to the `serverless` command line tool.
You can install it by running the following command:

```bash
npm install -g serverless
```

In addition, you will need Docker installed to run the tests. 
You can install Docker by following the instructions here: [Docker Getting Started](https://docs.docker.com/get-docker/).

To initialize the code itself, you can run the following command:

```bash
npm install
```

### Configuration

The codebase uses the `serverless-dotenv-plugin` to load environment variables from a `.env` file.
The `.env` file should be created in the root of the project and should contain the following variables:

```bash
STAGE=dev                             # The stage you are running the serverless API in

SQS_ACCESS_KEY_ID=local               # These values are used to connect to the local ElasticMQ instance
SQS_SECRET_ACCESS_KEY=local
AWS_DEPLOY_REGION=us-east-1           # NOTE: this is the default for the local system - production can be different

APP_SECRET=secret                     # This is used to sign JWT tokens (it should not be "secret" in production)
SALT_ROUNDS=10                        # This is used to hash passwords (10 is a good default value)

MYSQL_HOST=localhost                  # These values are used to connect to the local MySQL instance
MYSQL_USERNAME=root
MYSQL_PASSWORD=Sunshine123!
MYSQL_DATABASE=dynamic

KEYCLOAK_URL=http://localhost:8080    # These values are used to connect to the local Keycloak instance
KEYCLOAK_REALM=master
KEYCLOAK_CLIENT_ID=local-client
KEYCLOAK_CLIENT_SECRET=1f88bd14-7e7f-45e7-be27-d680da6e48d8

S3_ACCESS_KEY_ID=S3RVER
S3_SECRET_ACCESS_KEY=S3RVER
S3_ENDPOINT=http://localhost:4569/cdgs-templates
S3_BUCKET=cdgs-templates

CARBONE_KEY=test_eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4MjExNDIxOTk5NTQ2NDI0OTEiLCJhdWQiOiJjYXJib25lIiwiZXhwIjoyMzY5NjAyOTc4LCJkYXRhIjp7InR5cGUiOiJ0ZXN0In19.AART7kpZkS75k4V82UDzVk4kFGJuIYXi7b_ixV_f0mAL_kQ2TYBhnRhFnVMPCtR4GZFfU1bliIg4tMxbi7F_lr_OAOSQ8RiZgnmH7VN7CWhvFpro4f0Z-owpk_jAUbDVAiqFFSgzRDMjHNNSMC_kyiEeUVxzMpxCo9yvMhHAR1y1nZKY
CARBONE_URL=https://api.carbone.io
CARBONE_CACHE_DIR=/var/lib/file-cache/data
CARBONE_CACHE_SIZE=2GB
CARBONE_CONVERTER_FACTORY_TIMEOUT=60000
CARBONE_FORM_FIELD_NAME=template
CARBONE_START=true
CARBONE_UPLOAD_COUNT=1
CARBONE_UPLOAD_SIZE=25MB
```


### Running the Server

The codebase has been configured to allow you to run the server locally using the serverless-offline plugin.
While this creates a local API environment - including all the endpoints, it does not create the necessary infrastructure 
(e.g. MySQL tables, SQS queues, etc.) that the API relies on.

To solve this problem, we've created a `dev` stage that will create the necessary infrastructure for you.
This infrastructure is emulated using several Docker containers, including MySQL and ElasticMQ (for local SQS execution).

To start the server, you can run the following command:

```bash
npm start
```

This will start the serverless-offline plugin and create the necessary infrastructure for the `dev` stage.
The docker containers will be downloaded and initialized.  The serverless-offline plugin will start the API and 
(if you're using the default settings) you can access it at `http://localhost:3000`.


### Running the Tests

The tests rely on the Docker containers for both MySQL and ElasticMQ (for local SQS testing). You can run the tests by running the following command:

```bash
npm run test
```

Or, if you are actively working on the code and have the serverless framework running (using serverless-offline) then you will already have the docker containers running and can run the tests using the following command:

```bash
npm run jest
```

This will execute the tests without starting and stopping the docker containers.

### Deployment

The codebase is configured to deploy to AWS using the Serverless Framework.  
To that end, you will need to have the AWS CLI installed and configured with the appropriate credentials.

Once you have the AWS CLI installed and configured, you can deploy the codebase using the following command:

```bash
serverless deploy --stage production --region us-east-1
```

If you are deploying using a CI/CD pipeline, you must use this command to create the deployment package.
The AWS CLI takes care of translating the serverless.yml file into the necessary CloudFormation templates and deploying them to AWS.

In general, we have found that deployment is best done using a CI/CD pipeline.  This allows for automated testing and deployment of the codebase.
In addition, it will pull the latest code from a repository and deploy it to the appropriate stage.

Our recommendation for a CI/CD pipeline is to use [Seed.run](https://seed.run/)  
It is a serverless deployment platform that is built on top of the Serverless Framework and it can handle incremental updates
make deployment faster.

