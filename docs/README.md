# Notes on Code

## 1. Introduction

Throughout this project you will find unusual bits of code that may leave you scratching your head.
In the notes below, you should be able to find some explanation for these oddities.

## 2. The Code

### 2.1. /* istanbul ignore next */  
This is a comment that is used to tell the Istanbul code coverage tool to ignore the next line of code.
This is useful when you have a line of code that is not covered by tests, but you know it is working correctly.

That said, we should always strive to have 100% code coverage, so use this sparingly.

The reason that you will see it in the code currently is because the transpiled code from TypeScript
will often create lines of code that are in different places.  For example, returning promises in an
async function will often create a line of code that is not covered by tests (even though the line IS 
covered by the tests before transpilation). This is a known issue with TypeScript and the code coverage
tools.

This is the fix.

```javascript

console.log('This line is not covered by tests');

/* istanbul ignore next */
if (environment === 'production') { console.log('not covered by tests - because it can\'t be executed by the local tests'); }
```

### 2.2. Logger

The logger is a simple library to abstract away the console logging.  It is used to make it easier to
turn off logging in production.  It also makes it easier to test the logging.

In addition, the logger can be extended to log to other services (e.g. loggly, papertrail, etc.)
We have shown an example of this using the MySQL database.

Currently, there is logic around the log levels and whether or not to push the logs to the console.
That logic does not extend to the logger database calls.  Everything gets written every time.

This can be modified by updating the LOG_LEVEL environment variable.

**IMPORTANT:** The logger will only accept text.  If you try to push binary data in without encoding it
in some way (Base64 or hex as text), the logger will throw an error.

The message field in the database is a MEDUIMTEXT field.  This means that it can hold up to 16MB of data.

.env file:
```
LOG_LEVEL=info
-or-
LOG_LEVEL=warn
-or-
LOG_LEVEL=off
```
