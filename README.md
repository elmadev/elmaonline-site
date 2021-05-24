# elmaonline-site

Node JS based backend for the [elmaonline site](https://elma.online). The frontend is found in the [elmaonline-web repo](https://github.com/elmadev/elmaonline-web). Note that this repo still contains old frontend code, but all new frontend development should be made in elmaonline-web.

- [test.elma.online](http://test.elma.online) New features will be tested here first, this site uses a secondary copy of the database, so you can mess up as much as you want here, and nothing you do here will be saved on the real site.
- [elma.online](http://elma.online) This site will be using the live database.

## Branches

- **dev**
  - The primary branch to use while developing. Make all changes to this branch, preferably as pull requests. Test server uses this branch.
- **master**
  - This branch reflects the version currently deployed on [elma.online](http://elma.online), only people actually deploying will be pulling code to this.

## Get started

1. Install if needed nodejs and yarn
2. Clone this repo
3. Run `yarn` in terminal to install depedencies
4. Run `yarn start` in terminal to start development server

- Run `yarn build` in terminal to make a production build.

## Config

`src/config.defaults.js` has default config, this should only be changed if you are adding new keys.
`src/config.local.js` has your local config changes, it's empty by default, so just add keys from the above that you wish to change. To make git ignore changes to the file run `git update-index --skip-worktree src/config.local.js`.
`src/config.js` merges the two files above with priority to local.js, this is the file that should be included when using config values in the code for example `import config from './config';` if you're in the src folder.

## Tech stack

- [Express](http://expressjs.com/) as the backend framework
- [react-starter-kit](https://github.com/kriasoft/react-starter-kit) boilerplate starter kit that we plan on using, includes backend and frontend, frontend has been moved to CRA in the [elmaonline-web repo](https://github.com/elmadev/elmaonline-web).
- [sequelize](http://docs.sequelizejs.com/manual/tutorial/querying.html) for database querying
- [discord.js](https://discord.js.org/#/) for the discord bot

## Setup editor

The project is configured to use eslint and prettier to ensure good coding practices. Make sure you install relevant plugins for your editor.

Visual Studio Code:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Test database

The config is set up to use a test database. Bear in mind the following:

- Test database is a copy of live from end june 2020
- time and battle tables only have a subset of live (from mid 2019ish) to keep size down
- Passwords, emails and private comments have been stripped

Explanation of database structure can be found in [this google sheet](https://docs.google.com/spreadsheets/d/15fNKf2ihV4HvmVZwxg2D18ITvcbCE1nva5NTFlYJOgg/edit?usp=sharing).

## Communication

Feel free to create issues here on github in order to discuss things related to the project. You can also join the [elma discord](https://discord.gg/j5WMFC6) #developers channel to chat.
