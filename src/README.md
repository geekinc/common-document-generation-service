# Project Source Code

This is where we put all of the code that makes up the serverless API.  The code is organized into several directories:

- `__tests__`   
  - **This directory contains the code for the tests.**
  - The tests are responsible for testing the code in the other directories.
  - The tests are written using the `jest` testing framework.
  - The tests are run using the `npm run test` command.
  - The tests are run using the `npm run jest` command - this will require MySQL endpoints to run.
  - More information about the tests can be found in the [./\__tests__/README.md](./__tests__/README.md) file.
- `lambda`      
  - **This directory contains the code for the lambda functions.**  
  - The lambda functions are responsible for handling the requests and returning the appropriate responses.
  - The lambda functions have a specific format that is required by the serverless framework.
  - The lambda functions are written using the `async` and `await` keywords.
  - More information about the lambda functions can be found in the [./lambda/README.md](./lambda/README.md) file.
- `lib`         
  - **This directory contains the code for the libraries.**  
  - The libraries are responsible for handling the business logic and interacting with the database.
  - The libraries are written using the `async` and `await` keywords.
  - More information about the libraries can be found in the [./lib/README.md](./lib/README.md) file.
