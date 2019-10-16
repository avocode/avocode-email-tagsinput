# avocode-email-tagsinput

This monorepo contains three packages:

1. `@avocode/avocode-email-tagsinput`

    React input component for typing emails that are converted into tags. It uses base component from `better-react-tagsinput` library. It exposes component `AvocodeEmailTagsInput`. [README](packages/avocode-email-tagsinput/readme.MD)

2. `@avocode/better-react-tagsinput`

    React input component / editor created with SlateJS library. Its intended usage is to render, create and remove tags inside input. The input can also be collapsible (have overflow via CSS). It is controlled component which must receive `tags` and `query` props, along with callbacks for events that change the input state. [README](packages/better-react-tagsinput/readme.MD)

3. `playground`

    React app to be used during development of all the packages. [README](packages/playground/readme.MD)

## Development

Library uses `npm` package manager to manage the dependencies. All the scripts mentioned here need to be prefixed with `npm run [script]` unless stated otherwise. **Run all the scripts from the root directory**.

The `babel` configuration is shared across the packages so first you need to run `npm install`. The monorepo is managed by Lerna so after the install is complete, the dependencies will be resolved to root `node_modules` directory. Versioning is set up so each package has the same version all the time.

Webpack config is also shared for the most part and will output the result to `dist/` directories in each package.

* `start`
   Starts builds in watch mode in the all packages and runs dev server for `playground`. The changes in any package will be updated live. Use this command to develop the libraries and preview changes.

## Build

Each package can be built using `build` script in each package directory. You can build specific package from the root directory by running `npm run build:package` and pass package name as argument. The distribution files will be located within `dist/` folder for each package.

* `build`
   Builds all packages.

* `build:package`
   Builds specific package that is passed as argument.

## Publish

Each package has its own `prepublish` script that will trigger builds. Packages are published to npm registry to private `@avocode` workspace so you need to run `npm login` first (this is important). The exception is `playground` package that has different publish target.

Before publishing make sure you increment version in each package since it's published by git tags.

* `publish`
   Builds and publishes all packages.

* `publish:package`
   Publishes specific package that is passed as argument.

* `version`
   Pass version as argument to change all packages to that specific version. Info is read from `lerna.json` file.

## Clean

* `clean:all`
   Clears `dist/` and `node_modules/` folders in each package

* `clean`
   Clears only `dist/` folders in each package.

* `clean:package`
   Clears only `dist/` folder in specific package that is passed as argument.

## Lint & Type checking

The project uses Flow type library. The libraries are set up to expose type definitions to their environment. External type definitions are prepared during build.

* `flow`
   Typechecks all packages.

* `eslint`
   Runs linter.

## Test

* `test`
   Runs unit tests for all packages.

* `test:e2e`
   Runs end-to-end tests for production environment.

* `test:e2e:dev`
   Runs end-to-end tests for development environment. It needs to
   have dev server running for `playground` package first.

* `test:e2e:dev:full`
   Runs end-to-end tests for development environment. It will run dev
   server first and launch tests after about 20 seconds. Use this command
   if you simply want to launch the tests.
