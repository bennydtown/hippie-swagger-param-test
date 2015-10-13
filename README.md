# Testing problems validating with required formData params in hippie-swagger

This project is intended to isolate and illustrate an issue I found attempting
to validate parameter schemas included in some swagger specifications.

## Setup

```bash
git clone <REPOSITORY URL>
cd hippie-swagger-param-test
npm install
npm test
```

## Observed Behavior

The suite includes two tests that are identical except that one dereferences
the swagger spec before schema validation, and the second does not.  In theory,
both of these tests should behave identically, but in fact the test that includes
spec dereferencing fails, while the other passes.

```bash
➜  hippie-swagger-param-test  npm test

> application-name@0.0.1 test /Users/ben.ringold/Documents/src/welltok/hippie-swagger-param-test
> NODE_ENV=test ./node_modules/mocha/bin/mocha

connect deprecated methodOverride: use method-override npm module instead app.js:20:17


Express server listening on port 3000
  Test /
POST / 200 136.113 ms - 13
    ✓ Test Without dereferencing swagger first (155ms)
    1) Test with dereferencing swagger first


  1 passing (169ms)
  1 failing

  1) Test / Test with dereferencing swagger first:
     Uncaught Error: Missing required parameter in formData: dummy
      at validateRequiredParams (node_modules/hippie-swagger/lib/parameters.js:56:15)
      at node_modules/hippie-swagger/lib/parameters.js:95:5
      at Array.forEach (native)
      at parameters (node_modules/hippie-swagger/lib/parameters.js:94:23)
      at Client.middleware (node_modules/hippie-swagger/lib/middleware.js:24:13)
      at next (node_modules/hippie/lib/hippie/client.js:424:5)
      at Client.setup (node_modules/hippie/lib/hippie/client.js:425:5)
      at node_modules/hippie/lib/hippie/client.js:357:10
      at Client.exports.json [as serialize] (node_modules/hippie/lib/hippie/serializers.js:28:3)
      at Client.end (node_modules/hippie/lib/hippie/client.js:354:8)
      at testEndpoint (test/index.js:14:6)
      at test/index.js:24:7
      at node_modules/call-me-maybe/index.js:11:28
```

This particular failure seems to require the confluence of three factors:

- The parameter needs to be **"in": "formData"**
- The parameter needs to have a **"required": "true"** property.
- The swagger spec must be dereferenced with swagger-parser.dereference

I assume that the problem arises from the form parameters being actually
sent in the body/payload of the request, the really confusing factor is that
third condition.
