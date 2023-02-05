# Market Depth API

## Requirements
* pnpm
* nodejs >= 16.15.1

## Project Structure
```
dist                         // build
src
    api
       moduleAPI
            *.controller.ts
            *.router.ts
            *.service.ts
    core                    // platform share
        config.ts           // environment variables
        decorators.ts       // utils decorator
        logging.ts          // custom logger
        types.ts            // custom types
    services                // Share services/Share business requirements
        *.service.ts
    app.ts
    index.ts

__test__ folder for unit test
```

## Features
* Packages manager with [pnpm](https://pnpm.io)
* [Swagger](https://brikev.github.io/express-jsdoc-swagger-docs/#/) call ```app.setupSwagger(config)``` to enable
* Logger API with [morgan](https://expressjs.com/en/resources/middleware/morgan.html)
* Custom validation API @ValidateController() with [zod](https://github.com/colinhacks/zod)
* Testing with [jest](https://jestjs.io/)

## Run test
* Create .env.test
* run pnpm test or pnpm test:watch