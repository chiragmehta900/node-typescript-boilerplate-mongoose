
# Node TypeScript Boilerplate Mongoose

The main purpose of this repository is to show a good end-to-end project setup and workflow for writing a Mongoose Node.js Express code in TypeScript complete with middleware, models, routes, and types.

This example comes with a complete REST API to handle Authentication and CRUD features on Users and their corresponding Profile.
## Tech Stack

**Server:** Node, Express, typescript, ts-node

**DataBase:** mongoose


## Run Locally

Clone the project

```bash
  git clone https://github.com/chiragmehta900/node-typescript-boilerplate-mongoose
```

Go to the project directory

```bash
  cd node-typescript-boilerplate-mongoose
```

Install dependencies

```bash
  npm install
```

Start the tsc

```bash
  npm run watch
```

Start the server

```bash
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV="production"`, 
`NODE_ENV="local"`, 
`MONGO_DB_USER`, 
`MONGO_DB_PASSWORD`. 
`JWT_SECRETS`, 
`SMTP_HOST`, 
`SMTP_PORT`, 
`SMTP_USERNAME`, 
`SMTP_PASSWORD`, 
`SMTP_SENDER`,


## Project Structure

The most obvious difference in a TypeScript + Node project is the folder structure. In a TypeScript project, it's best to have separate _source_ and _distributable_ files. TypeScript (`.ts`) files live in your `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run start`

| Name               | Description                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **config**         | Contains config environment to be used by the config package, such as MongoDB URI, jwtSecret, and etc.                                                        |
| **dist**           | Contains the distributable (or output) from your TypeScript build                                                                                             |
| **node_modules**   | Contains all your npm dependencies                                                                                                                            |
| **src**            | Contains your source code that will be compiled to the dist dir                                                                                               |
| **src/middleware** | Contains the middlewares to intercept requests                                                                                                                |
| **src/models**     | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB                                                                  |
| **src/controller** | The controller accesses the database through the model                                                                                                        |
| **src/routes**     | Routes define the endpoints of your API                                                                                                                       |
| **src/interfaces** | Contains all your custom types to better handle type checking with TypeScript                                                                                 |
| **src/services**   | Contains custom types of services like sending mail and etc..                                                                                                 |
| **src/templates**  | Contains custom mail templates of send mail for users.                                                                                                        |
| **src/index.ts**   | Entry point to your express app                                                                                                                               |
| package.json       | File that contains npm dependencies as well as build scripts                                                                                                  |
| tsconfig.json      | Config settings for compiling server code written in TypeScript                                                                                               |
| tslint.json        | Config settings for TSLint code style checking                                                                                                                |

### Configuring TypeScript compilation

TypeScript uses the file `tsconfig.json` to adjust project compile options.
Let's dissect this project's `tsconfig.json`, starting with the `compilerOptions` which details how your project is compiled.

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "lib": [
      "es2016",
      "dom"
    ],
    "allowJs": true,
    "checkJs": true,
    "declaration": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "pretty": true,
    "experimentalDecorators": true,
    "typeRoots": [
      "node_modules/@types"
    ]
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```
## Documentation

[Documentation](https://linktodocumentation)


## API Reference

#### Create user

```http
  POST user/sign-up
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `firstName`      | `string` | **Required**. Your API key |
| `lastName`      | `string` | **Required**. Your API key |
| `avatar`      | `string` | **Required**. Your API key |
| `email`      | `string` | **Required**. Your API key |
| `password`      | `string` | **Required**. Your API key |
| `confirmPassword`      | `number` | **Required**. Your API key |

#### login user

```http
  POST auth/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `number` | **Required**. Your API key |
| `password`      | `string` | **Required**. Your API key |


#### Get all users

```http
  GET user/fetch
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `_id` | `uuid` | **Required**. Your API key |
| `firstName` | `string` | **Required**. Your API key |
| `lastName` | `string` | **Required**. Your API key |
| `gender` | `string` | **Required**. Your API key |
| `dateOfBirth` | `string` | **Required**. Your API key |
| `residence` | `string` | **Required**. Your API key |
| `avatar` | `string` | **Required**. Your API key |
| `email` | `string` | **Required**. Your API key |
| `password` | `string` | **Required**. Your API key |
| `role` | `string` | **Required**. Your API key |
| `isEmailVerified` | `boolean` | **Required**. Your API key |
| `isEmailVerified` | `boolean` | **Required**. Your API key |

A postman collection has been added for better understanding.


## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)

[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Author

- [@chiragmehta900](https://www.github.com/chiragmehta900)


## Support

For support, email chiragmehta900@gmial.com or join our Slack channel.

