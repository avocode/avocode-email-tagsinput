# avocode-email-tagsinput

This monorepo contains three packages:

1. `avocode-email-tagsinput`

React input component for typing emails that are converted into tags. It uses base component from `better-react-tagsinput` library.

2. `better-react-tagsinput`

React input component / editor created with SlateJS library. It displays the input, handles the input and renders tags. It also manages keyboard shortcuts within the input.

3. `playground`

React app to be used during development of all the packages.

## Development

The `babel` configuration is shared across the packages so first you need to run `npm install`. After this you need to install package dependencies and link them together: `npx lerna bootstrap`.

To run playground app (`playground` package) just run `npm start` and it'll launch development server on port `8080`.

## Build

Each package can be built using `build` script in each package directory. You can build specific package from the root directory by running `npm run build:package` and pass package name as argument. The distribution files will be located within `dist/` folder for each package.

## Publish

Each package can be published using `publish` script in each package configuration. Building specific package is done by runnin `npm run publish:package` from root directory. You need to pass package name as argument. `prepublish` script will be triggered as well if available.

### Publishing playground

Every time any of the libraries are changed, the playground should be published as well so new changes can be demonstrated, reviewed, etc. The playground is published publicly using [surge.sh]() service at [https://avocode-email-tagsinput.surge.sh](https://avocode-email-tagsinput.surge.sh). To publish updated playground run `npm run publish:package playground` which will create new build and upload it to the domain. You need to be logged in to _surge.sh_ service in order for it to work correctly.

Alternatively you can distribute files in `packages/playground/dist/` anywhere you wish.
