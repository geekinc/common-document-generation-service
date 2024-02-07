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
