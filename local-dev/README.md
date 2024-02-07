# local-dev

This is where we keep all the configuration and data for the local development environment.  
Specifically configured docker instances are used to test the serverless API on a local machine.
Each of these instances is configured to run a specific part of the serverless infrastructure.

In production, each of these instances would be replaced by a cloud service.

The details of the configuration and data for each of these instances can be found in the `.env` file in the root of this project.

## ElasticMQ

ElasicMQ is a message queue that is used to send messages between the lambda functions.  We use it to simulate
SQS Queues in the local development environment. This lets us trigger events and test the lambda functions locally.

NOTE: The ElasticMQ instance is not used in the production environment.  Instead, we use AWS SQS.

The local ElasticMQ configuration is in the `./elasticmq/conf` file.  

Additionally, there are specific commands executed in the `./local-start.sh` file to start and configure the ElasticMQ 
instance into a "known good" state. This lets our tests run consistently with known responses to specific input requests.

The `.env` values needed for the Serverless Framework to use the ElasticMQ instance are:

```bash
SQS_ENDPOINT=http://localhost:9324
SQS_ACCESS_KEY_ID=local
SQS_SECRET_ACCESS_KEY=local
SQS_QUEUE_NAME=basicQueue
AWS_DEPLOY_REGION=us-east-1
```

Additional details about ElasticMQ can be found at: [https://github.com/softwaremill/elasticmq](https://github.com/softwaremill/elasticmq)

## KeyCloak

KeyCloak is an open-source Identity and Access Management solution.  
We use it to simulate the production OpenID Connect service in the local development environment.
This lets us test the production authentication workflow locally.  This is *in addition* to the local authentication
system that generates local JWT tokens.  The local authentication system is used to test the API Gateway and Lambda
functions without needing to authenticate with an external KeyCloak instance.

The local KeyCloak configuration is in the `./keycloak/client.json` file.

Additionally, there are specific commands executed in the `./local-start.sh` file to start and configure the KeyCloak.

The following steps are executed to configure the KeyCloak instance:

* Create the client  (based on `./keycloak/client.json`)
* Create the basic application admin role  (`app_admin`) 
* Create the basic application user role  (`app_user`)
* Create the application admin user  (`foo`)
* Create the password  (`456`)
* Apply an admin role to the user
* Apply an application admin role to the user
* Apply an application user role to the user
* Create the application general user  (`bar`)
* Create the password  (`456`)
* Apply an application user role to the user

The commands to execute these steps are in separate script files under the `./user-scripts` directory.

The `.env` values needed for the Serverless Framework to use the KeyCloak instance are:

```bash
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=master
KEYCLOAK_CLIENT_ID=local-client
KEYCLOAK_CLIENT_SECRET=1f88bd14-7e7f-45e7-be27-d680da6e48d8
```

Additional details about KeyCloak can be found at: [https://www.keycloak.org/](https://www.keycloak.org/)


## MySQL

MySQL is a popular open-source relational database. We have found that most production applications require some form
of relational database.  We use it to simulate the production database in the local development environment.

The local MySQL configuration is in the `./mysql/config.conf` file. (This includes the root user and password)

Additionally, there are specific commands executed in the `./local-start.sh` file to start and configure the MySQL instance.

* Create the database (`./mysql/create-tables.sql`)
* Populate the database (`./mysql/populate-tables.sql`)

These files can also be used to reset the database to a known state.  This lets our tests run consistently with known
responses to specific input requests.

The `.env` values needed for the Serverless Framework to use the MySQL instance are:

```bash
MYSQL_HOST=localhost
MYSQL_USERNAME=root
MYSQL_PASSWORD=Sunshine123!
MYSQL_DATABASE=cdgs
```

Additional details about MySQL can be found at: [https://www.mysql.com/](https://www.mysql.com/)


## Serverless-S3-Local

Serverless-S3-Local is a plugin for the Serverless Framework that simulates the AWS S3 service on a local machine.
It's a little different than the Docker instances we talked about above.  This is a plugin that runs inside the
serverless-offline plugin. It doesn't run in a separate Docker container.  Instead, it runs in the same Node.js
process as the serverless-offline plugin.

As a result, it doesn't need to be started or configured separately.  It's just there when you start the serverless-offline
plugin.  The `.env` values needed for the Serverless Framework to use the Serverless-S3-Local plugin are:

```bash
S3_ACCESS_KEY_ID=S3RVER
S3_SECRET_ACCESS_KEY=S3RVER
S3_ENDPOINT=http://localhost:4569
S3_BUCKET=cdgs-templates
```

The one caveat is that the S3_BUCKET must be created before the serverless-offline plugin is started.  Our repository
is configured for a current cdgs-templates bucket.  If you want to use a different bucket, you'll need to create it
before starting the serverless-offline plugin.

Additionally, the `./local-stop.sh` file contains the command to clean the S3_BUCKET. It's a simple linux shell command
to wipe out everything in the bucket each time the system stops.  The only file that will persist is the `.placeholder`
file. This is to keep the directory from being removed by Git.

Additional details about Serverless-S3-Local can be found at: 
[https://www.serverless.com/plugins/serverless-s3-local](https://www.serverless.com/plugins/serverless-s3-local)
