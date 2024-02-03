# Jest Tests

This directory contains all the tests that will be executed using the Jest testing framework.

The tests are responsible for testing the code in the other directories. However, each test runs in a separate 
environment and does not share state with other tests. In addition, the local serverless-offline plugin will not
be running.  This means that the tests are more about testing the code and less about testing the infrastructure.

These tests load the environment variables from the `.env` file in the root of the project.  This means that the 
`.env` file should contain the necessary variables to connect to the local MySQL and ElasticMQ instances.

The tests themselves import the necessary code from the other directories and test the code using known inputs and
expected outputs.

For system calls that simply cannot be tested locally (i.e. SQS callbacks), the functions are mocked. This means
that, while the code has 100% coverage, the tests are not 100% comprehensive.  So, if all the tests are passing, but
the system is not working, then it is likely that the infrastructure is not working as expected.

The tests expect the database to be in a known state.  This means that the database will be seeded with the necessary
data before the tests are run.  This is done using the `../local-dev/local-start.sh` and `../local-dev/local-stop.sh` 
scripts. They download the docker containers and start the necessary infrastructure for the `dev` stage.

The `../local-dev/mysql/create-tables.sql` script gets executed each time the MySQL container is started.

The tests are run using the `npm run test` command from the root of the project.

If you want to do quick testing while developing, you can run the tests using the `npm run jest` command. This will
only execute the Jest tests without starting and stopping the docker containers.

---
**NOTE**
If you run `npm run jest` make certain that the docker containers are already running. 
You can start them manually using `npm run pretest`. 
To stop them, you can use `npm run posttest`.
___
