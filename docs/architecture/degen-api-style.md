# Degen-API Architecture & Style Guidelines

## About

This project is built with [NestJS](https://docs.nestjs.com/) using the [fastify](https://docs.nestjs.com/techniques/performance) adapter. The project is maintained as an [NX project](https://nx.dev/) and all dependency upgrades should be handled via [NX cli migrations](https://nx.dev/l/r/core-concepts/updating-nx). View the NX documentation on how to leverage it to execute operations like [serving](https://nx.dev/l/r/cli/serve), [linting](https://nx.dev/l/r/cli/lint), [testing](https://nx.dev/l/r/cli/test), [building](https://nx.dev/l/r/cli/build), and even [generating new code](https://nx.dev/l/r/nest/overview).

## Table of Contents

- [File and Module Structure](#file-and-module-structure)
- [Logging](#logging)
- [Database](#database)
- [Service Abstraction Layer](#service-abstraction-layer)
- [DTOs and Validation](#dtos-and-validation)
- [Automatic Swagger Docs](#automatic-swagger-docs)
- [Discord Integration](#discord-integration)

<br />

## File and Module Structure

### Modules

NestJS includes a [module system](https://docs.nestjs.com/modules) that helps manage the dependency injection hierarchy in a modular fashion (if you are familiar with [Angular](https://angular.io/) modules and DI this is nearly identical). This API should only ever contain three types of modules the `CoreModule`, `SharedModules` and `FeatureModules`:

- The `CoreModule` is a root level [global module](https://docs.nestjs.com/modules#global-modules) that imports all app wide modules, services, and more. It also houses globally used singletons like utility functions, models, DTOs, and more.

- A `FeatureModule` is the most common module. Each feature module should contain everything required for a given feature. If we are strict about this a feature can easily be spun off into its own microservice down the road if that is ever needed.

- A `SharedModule` would be any module that could be imported in more than one module. This module should take care to not import any singletons and isolate scope to only where it is imported.

### File Naming Patterns

Every file should be named by the type of pattern it implements: `{feature}.{pattern}.ts`. Patterns should largely all be standard concepts from NestJS patterns: `module`, `service`, `controller`, `dto`, `guard`, `pipe`, `interceptor`, `decorator`, etc...

We might include some custom patterns like `model` which should implement the `dto` pattern for interoperability as a controller input but is specifically used to define a database model/entity shape and type.

### Module File Structure

All modules should include their internal dependencies following the naming convention above.

However, **_IF_** there is more than one of that "thing" they should be grouped into folders corresponding with the pattern they implement - EX: `{feature}/services`, `{feature}/models`, `{feature}/controllers`, etc...

<br />

## Logging

Although this project uses Winston for logging, you **_always_** log information using the built in [NestJS `Logger`](https://docs.nestjs.com/techniques/logger). To use this interface you must import the `Logger` type and inject it where needed:

```typescript
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
class ExampleService {
  constructor(private logger: Logger) {}

  // ...
}
```

### Winston & NestJS Integration

This project leverages [winston](https://github.com/winstonjs/winston) for logging. Winston allows us to customize formatters and transports per environment so that locally logs can be pretty printed and written to the console while in upper level envs they can be JSON formatted and written to external services like LogDNA.

We integrate winston with NestJS via the [nest-winston](https://github.com/gremo/nest-winston) package. Nest-winston takes in a winston configuration and outputs a logger service that implements the NestJS logger service interface. We then pass this to NestJS at bootstrap time in the projects `main.ts` file for NestJS to use as the default logger everywhere. This means that when you inject the `Logger` you are actually getting a logger that will write logs according to the given winston configuration for the current env.

### Automatic Request & Exception Logging

This project automatically logs some basic information for all incoming requests. Any exception that gets thrown from a controller endpoint (that then gets caught by the NestJS global [exception filter](https://docs.nestjs.com/exception-filters)) also then gets logged.

Requests are all logged by the custom global `LoggingInterceptor`. Exceptions are all logged by the custom global `LoggingExceptionFilter`.

Be sure to throw a standard [NestJS exception](https://docs.nestjs.com/exception-filters#throwing-standard-exceptions) as an error to have the response status automatically set to match that exception type and logged accordingly.

<br />

## Database

### Typegoose & NestJS Integration

This project leverages [typegoose](https://typegoose.github.io/typegoose/docs/guides/quick-start-guide) via [nestjs-typegoose](https://kpfromer.github.io/nestjs-typegoose/docs/usage). Typegoose allows us to specify types for mongo collections via Typescript classes with special decorators. Nestjs-typegoose allows us to [define these models as module dependencies](https://kpfromer.github.io/nestjs-typegoose/docs/usage#providing-the-model-for-our-services) to they can be [injected via NestJS DI](https://kpfromer.github.io/nestjs-typegoose/docs/usage#creating-the-service).

### Models

Define mongo models following the proper file format: `{collection}.model.ts`. A model can also be decorated with class-validator decorators so it can be used as controller param/body inputs as well or extended via [mapped types](https://docs.nestjs.com/openapi/mapped-types) to declare request and response objects more easily.

**Do not put business logic in models.** I repeat, do not put business logic in models. Fat Models/the Active Record pattern are bad patterns. They often lead to convoluted, hard to follow logic, hard to test operations, and confusion around where new logic belongs. Keep models dumb and use the only as type and validation definition sources.

<br />

## Service Abstraction Layer

**Do not put business logic in controllers.** I repeat, do not put business logic in controllers. All business logic should be abstracted to services. Controllers should merely serve to declare endpoints and their metadata.

> Why is this not redundant?

Because services can be mocked extremely easily for unit and integration testing as needed. This also allows us to reuse business logic to expose something other than REST endpoints, like GraphQL queries and mutations, very very easily down the line if needed.

<br />

## DTOs and Validation

Data Transfer Objects or DTOs in NestJS are used to define two things:

- The types of data request and response object properties
- How those input data properties should be validated

To do this DTOs must be classes instead of interfaces so they exist at runtime. This project leverages the [NestJS validation pipe](https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe) [globally](https://docs.nestjs.com/pipes#global-scoped-pipes) which inspects controller input params and body objects for validation decorator data. This global pipe then leverages [class-transformer](https://github.com/typestack/class-transformer) to transform the input into properly typed class instances and then uses [class-validator](https://github.com/typestack/class-validator) to validate them.

**tldr;** This means that, on any controller, input params and body objects will be automatically transformed to their defined types and validated.

<br />

## Automatic Swagger Docs

This project is configured to use the NestJS Swagger module that will automatically pluck information from DTOs and Controllers to generate OpenAPI documentation and expose it via Swagger at the endpoint `/api`.

Be sure to properly decorate DTOs and Controllers with the correct metadata information via the [NestJS OpenAPI decorators](https://docs.nestjs.com/openapi/decorators). Extend models via [mapped types](https://docs.nestjs.com/openapi/mapped-types) to declare request and response objects more easily as well.

<br />

## Discord Integration

This project connects to discord via [discord.js](https://discord.js.org/) via the [`@discord-nestjs/core`](https://github.com/fjodor-rybakov/discord-nestjs) module. This module configures a discord.js client for us and provides it as a service we can inject via DI anywhere in the project. This module is configured in the `CoreModule` so it can be used globally like so:

```typescript
import { Client } from 'discord.js';
import { DiscordClientProvider } from '@discord-nestjs/core';

export class ExampleService {
  private client: Client;

  constructor(private readonly discordClientProvider: DiscordClientProvider) {
    this.client = this.discordClientProvider.getClient();
  }
}
```

> In this API you should not used this module to define any commands or events as those belong in the bot.
