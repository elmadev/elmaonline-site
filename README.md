# elmaonline-site

Repo for a new open source version of the website for Elma Online.

Current website can be seen on http://elmaonline.net/. The point of making a completely new version is to use better suited frameworks and code structure, something that will better fit a multi developer open source project and the things we want to do with the site.

## Running the project locally

Follow these steps to install the site locally and start developing.
- Install latest stable version of [Node.js](https://nodejs.org/en/)
- Clone this repo using git to your local computer
- Open the node command prompt
- Open the directory where you cloned the project
- Run "npm install" which will install needed dependencies
- Run "npm run dev" which will start a local server
- Open [localhost:3000](http://localhost:3000/) on your browser to view the site

## Developing on the project

### Frameworks
The project uses the following frameworks. Consider checking out their tutorials to get started.
- [Express](http://expressjs.com/) with [Feathers](http://feathersjs.com/) for the backend API
- [react](https://facebook.github.io/react/) for the frontend user interface

### Principles
When developing always try to follow these principles.
- **Thinking in components**
  - Break the frontend code and HTML into small reusable components. Components should ideally only do one thing each, have its own js file, and use other components inside it as far as possible. Read more on react's [page on components](https://facebook.github.io/react/docs/thinking-in-react.html) which also covers the technical aspect.
- **Material Design**
  - The UI should follow the generel principles of [Material Design](https://material.io/guidelines/). We'll be using a react component for this, so you can just take UI components you need and build the page from that, adding in data component to fill them out.

### Dev tools
Consider these tools to help you.
- **JSX highlighting**
  - react uses a JSX syntax which your text editor may not be able to highlight properly without plugins. For sublime text for example use [babel sublime](https://github.com/babel/babel-sublime).
  
### Useful Tutorials
- [Explore the example pages](https://github.com/bertho-zero/react-redux-universal-hot-example/blob/master/docs/ExploringTheDemoApp.md)
- [Editing pages](https://github.com/bertho-zero/react-redux-universal-hot-example/blob/master/docs/AddingToHomePage.md)
- [Official react tutorial](https://facebook.github.io/react/tutorial/tutorial.html)
- [Understand react in 5 steps](https://medium.freecodecamp.com/the-5-things-you-need-to-know-to-understand-react-a1dbd5d114a3#.4oloyujg7)

## Things of note
- **Experimental phase**
  - We are still very much in the experimental phase, nothing written here is set in stone, so if you have any feedback on any of these please speak up.
- **Example code**
  - The project currently has a lot of example code from the starter kit we've used. These are kept in place for the time being to serve as example you can learn from. In time when we have written our own which can serve as examples they'll be removed.
- **Unnecessary dependencies**
  - The project comes with a lot of dependencies at the moment, many might be be needed and will be cleaned out when we have a better idea of what we need.
- **Database**
  - The project will be using a MySQL database, as this is what the game server uses we can't change this. This is not currently set up in the project.

## What to work on
We are right now in the experiment phase, so feel free to do anything, even if you know some of it might not be useful in the long term, we can learn from it. But you can also consider making some good base components which we can build the site on in the future. Some things you could do are:
- Develop a complete page from backend to UI, which can serve as proof of concept for all parts of the code.
- Develop generel api endpoints to serve the data which may be used by the frontend.
- Design a page of purely static content, which can be used to discuss user experience and later to fill out with actual data.
- Develop good base component for the frontend, serving some of the data that would be used a lot throughout the site.
- Research on some good dependencies that would be useful for the site.

## Communication
Feel free to create issues here on github in order to discuss things related to the project. You can also join the [elma discord](https://discord.gg/j5WMFC6) #developers channel to chat.
