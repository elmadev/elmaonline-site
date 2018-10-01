# elmaonline-site

Repo for an open source version of the website for Elma Online.

Current website can be seen on http://elmaonline.net/. The point of making a completely new version is to use better suited frameworks and code structure, something that will better fit a multi developer open source project and the things we want to do with the site. The new site will be available on a secondary URL until such a time as it can completely replace the old site.

- [test.elma.online](http://test.elma.online) New features will be tested here first, this site uses a secondary copy of the database, so you can mess up as much as you want here, and nothing you do here will be saved on the real site.
- [elma.online](http://elma.online) This site will be using the live database, so that we can enjoy new features as soon as possible, before we're able to completely replace the old site.

## Status

As of summer 2018 we have started making the first features on the site. Which means we can now start accepting contributions, and there's some code you can take a look at to get an idea for the structure. The [data flow](./docs/data-flow.md) doc contains a complete explanation of how to fetch data from the database and show it in the UI. Any comments or suggestions for improvements to this data flow is welcome right now.

## Branches

- **develop**
  - The primary branch to use while developing. Make all changes to this branch, preferably as pull requests.
- **test**
  - This branch reflects the version currently deployed on [test.elma.online](http://test.elma.online), only people actually deploying will be pulling code to this.
- **master**
  - This branch reflects the version currently deployed on [elma.online](http://elma.online), only people actually deploying will be pulling code to this.

## Developing on the project

Please check the guidelines in docs folder before you start developing, so we can follow the same principles more or less.
- [Getting started](./docs/getting-started.md)
- [Contributing](./docs/contributing.md)
- [Data flow](./docs/data-flow.md)
- [Rest based data fetching](./docs/data-fetching.md)
- [Configuring text editors](./docs/how-to-configure-text-editors.md)
- [React style guide](./docs/react-style-guide.md)

### Frameworks
The project uses the following frameworks. Consider checking out their tutorials to get started.
- [Express](http://expressjs.com/) as the backend framework
- [react](https://facebook.github.io/react/) for the frontend user interface
- [GraphQL](https://graphql.org/) a query language for the API
- [react-starter-kit](https://github.com/kriasoft/react-starter-kit) boilerplate starter kit that we plan on using, includes backend and frontend

### Principles
When developing always try to follow these principles.
- **Data flow**
  - Data flow in the app follows this principle: mysql -> sequelize -> graphql -> apollo -> UI
- **Thinking in components**
  - Break the frontend code and HTML into small reusable components. Components should ideally only do one thing each, have its own js file, and use other components inside it as far as possible. Read more on react's [page on components](https://reactjs.org/docs/thinking-in-react.html) which also covers the technical aspect.
- **Material Design**
  - The UI should follow the general principles of [Material Design](https://material.io/guidelines/). We are using [Material UI](https://material-ui.com/) for this, so you can just take UI components you need and build the page from that, adding in data component to fill them out.

### Dev tools
Check these tools for your preferred IDE. [More](./docs/how-to-configure-text-editors.md)

### Useful Tutorials
- [Official react tutorial](https://facebook.github.io/react/tutorial/tutorial.html)
- [Understand react in 5 steps](https://medium.freecodecamp.com/the-5-things-you-need-to-know-to-understand-react-a1dbd5d114a3#.4oloyujg7)
- [Sequelize MySQL querying](http://docs.sequelizejs.com/manual/tutorial/querying.html)
- Apollo, react and graphql [youtube](https://www.youtube.com/watch?v=kXH2dbnHYA0) or [slides](https://speakerdeck.com/mbrochh/using-apollo-with-reactjs-and-graphql)

## Communication
Feel free to create issues here on github in order to discuss things related to the project. You can also join the [elma discord](https://discord.gg/j5WMFC6) #developers channel to chat.
