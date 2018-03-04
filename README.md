# elmaonline-site

Repo for a new open source version of the website for Elma Online.

Current website can be seen on http://elmaonline.net/. The point of making a completely new version is to use better suited frameworks and code structure, something that will better fit a multi developer open source project and the things we want to do with the site.

## Status

Right now (as of March 2018) we are planning to use a different boilerplate starter kit (see next section) than what's in the repo right now, so don't make any contributions right now. We are in the process of setting on the base of this right now, once this is set up we can start letting more people contribute. The sections below are updated to reflect current plans, so you can still check that out to start learning about things.

## Developing on the project

### Frameworks
The project uses the following frameworks. Consider checking out their tutorials to get started.
- [Express](http://expressjs.com/)
- [react](https://facebook.github.io/react/) for the frontend user interface
- [react-starter-kit](https://github.com/kriasoft/react-starter-kit) boilerplate starter kit that we plan on using, includes backend and frontend

### Principles
When developing always try to follow these principles.
- **Thinking in components**
  - Break the frontend code and HTML into small reusable components. Components should ideally only do one thing each, have its own js file, and use other components inside it as far as possible. Read more on react's [page on components](https://facebook.github.io/react/docs/thinking-in-react.html) which also covers the technical aspect.
- **Material Design**
  - The UI should follow the generel principles of [Material Design](https://material.io/guidelines/). We'll be using a react component for this, so you can just take UI components you need and build the page from that, adding in data component to fill them out.

### Dev tools
Check these tools for your preferred IDE: https://github.com/kriasoft/react-starter-kit/blob/master/docs/how-to-configure-text-editors.md
  
### Useful Tutorials
- [Official react tutorial](https://facebook.github.io/react/tutorial/tutorial.html)
- [Understand react in 5 steps](https://medium.freecodecamp.com/the-5-things-you-need-to-know-to-understand-react-a1dbd5d114a3#.4oloyujg7)

## Communication
Feel free to create issues here on github in order to discuss things related to the project. You can also join the [elma discord](https://discord.gg/j5WMFC6) #developers channel to chat.
