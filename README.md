# elmaonline-site

Node JS based backend for the [elmaonline site](https://elma.online). The frontend is found in the [elmaonline-web repo](https://github.com/elmadev/elmaonline-web).

- [test.elma.online](http://test.elma.online) New features will be tested here first, this site uses a secondary copy of the database, so you can mess up as much as you want here, and nothing you do here will be saved on the real site.
- [elma.online](http://elma.online) This site will be using the live database.

## Branches

- **dev**
  - The primary branch to use while developing. Make all changes to this branch, preferably as pull requests. Test server uses this branch, and will automatically pull via github actions.
- **master**
  - This branch reflects the version currently deployed on [elma.online](http://elma.online), which will automatically pull via github actions.

## Get started

1. Install if needed nodejs (v18 or later, tested with up to v22)

   - If you install node using nvm you might need to install corepack manually
     `npm install -g corepack`

2. run `corepack enable` to enable yarn v3
3. Clone this repo
4. Run `yarn` in terminal to install depedencies
5. Run `yarn start` in terminal to start development server

## Config

- `src/config.defaults.js` has default config, this should only be changed if you are adding new keys.
- `src/config.local.js` has your local config changes, it's empty by default, so just add keys from the above that you wish to change.
- `src/config.js` merges the two files above with priority to local.js, this is the file that should be including when using config values in the code for example `import config from './config';` if you're in the src folder.

## Tech stack

- [Express](http://expressjs.com/) as the api framework
- [sequelize](http://docs.sequelizejs.com/manual/tutorial/querying.html) for database querying
- eslint and prettier for linting
- nodemon for auto reloading server when you edit files

## Folder structure

```
.
├── /                      # Various configuration files
├── /events                # Examples of event api calls
├── /public                # Static files served
├── /src                   # This is where your code will be
    ├── /api               # Endpoints used by frontend
    ├── /constants         # Constants used in code
    ├── /data              # Database models and json files
    ├── /middlewares       # Express middleware
    ├── /utils             # Helper functions etc.
    ├── /config.default.js # Default config
    ├── /config.js         # Combined config, use this in code
    ├── /config.local.js   # Local config changes
    ├── /dl.js             # Endpoints for downloads
    ├── /events.js         # Endpoints for events, called by game server
    ├── /index.js          # Entry point and express set up
    ├── /run.js            # Cron jobs and one time imports
    ├── /start.mjs         # Entry point for pm2
    ├── /upload.js         # Endpoints for uploads
```

## Imports

Be aware of newer nodejs versions requiring imports done with file extensions.

- Importing a relative path should always have the extensions: `import { func } from '../utils/funcs.js'`
- index files have to be written explicitly: `import { func } from '../utils/index.js`
- Imports done using aliases doesn't require this as the file extension is added in the alias: `import { func } from '#utils/funcs'`
- See and add aliases in `package.json`

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
