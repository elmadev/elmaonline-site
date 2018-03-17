# Data flow

This doc will explain how to fetch data from the database and show it in the UI. Note that you may not always have to code all these steps for each thing you make, as these components are made reusable, so you should always try to find existing components to use instead of creating new ones. In turn when you do have to make new components try to make them as resuable as possible. The data for elma online is saved in a MySQL database, and for the website shown in react components. As an example we are using the latest battles feature on the frontpage, which gets data from the battle table. See the comments in the linked files.

## 1. Defining data structure

The actual MySQL querying is done using the sequelize library. First thing you need to do is define the data model, in this case how a database table is structured. You can see the database structure by connecting to the test database using the credentials listed in the [./src/data/sequelize.js](sequelize.js) file or the [https://docs.google.com/spreadsheets/d/15fNKf2ihV4HvmVZwxg2D18ITvcbCE1nva5NTFlYJOgg/edit?usp=sharing](EOL database schema sheet). In order to make a new data model create a new file in the /src/data/models/ folder. See [./src/data/models/Battle.js](Battle.js) as an example.

## 2. Linking the data model

When the data model is defined you need to link it so sequelize knows it exists. This is done in [./src/data/models/index.js](/models/index.js), by importing the Battle.js file and exporting that again in the bottom of the index.js.

## 3. Building the queries

Sequelize is the library that does the actual MySQL querying, so you'll be using the sequelize functions to create queries. Learn more on [http://docs.sequelizejs.com/manual/tutorial/querying.html](their website). If there's no folder for the table you're querying create one in /src/data/graphql/Database/ and inside that one create a new .js file. We're using [./src/data/graphql/Database/battle/GetBattles.js](GetBattles.js) here as an example. This consists of 3 or 4 objects:

- schema: Database schema documentation for graphql
- queries: Database select queries documentation for graphql
- mutation: Database create/update/delete query documentation for graphql (currently no documented examples)
- resolvers: The actual queries built using sequelize

Inside the resolvers is also where you can apply any extra backend logic you want to apply to the data before sending it to the frontend.

## 4. Linking the queries

After creating the database queries you need to link them in the graphql [./src/data/graphql/Database/schema.js](schema.js).

## 5. Testing the queries

At this point you can test the queries using graphql's graphiQL tool. When you run the site locally it will be available on http://localhost:3000/graphql. You can check the [http://graphql.org/learn/queries/](graphql documentation) for more on how to do queries. To test the battle queries you can type in the following in the left side panel:

```
{
  getBattles {
    BattleIndex
    KuskiIndex
    LevelIndex
    BattleType
    Started
    Duration
  }
}
```

Click the play icon on the top left and you will see the result in the right side panel. You will get error messages here if something is wrong. This is also a good place to test if the queries you've made are too slow. The query you wrote here in the left side panel is the one you'll be using in the frontend react code. Use this tool to find the exact query you need. Inside the tool you can press space+enter to get a list of existing queries/fields.

## 6. Use the data in the frontend react

If you're making a new route (page) create a folder in /src/routes/ which will have a .css, a .graphql, an index.js and another .js file.

- In the [./src/routes/home/home.graphql](.graphql) file you paste the query you made in the graphiQL tool adding "Query SomeName" in front of it. As you can see in this example you can add multiple queries to the same file, and they'll be executed at once.
- In the [./src/routes/home/index.js](index.js) you import the secondary .js file, and place it as a component in the JSX.
- In the [secondary .js file](./src/routes/home/Home.js) you import the .graphql file at the top, in the bottom you place the object inside the graphql decorator which will place the result object of the query in the this.props object that you can use in the render. Deconstruct the this.props object to get some nicer sounding variable names. Then you can use the variable in the JSX, for example with a loop/map.

```
{loading
  ? 'Loading...'
  : getBattles.map(i => (
      <div key={i.BattleIndex}>
        <h2>
          {i.BattleIndex} - {i.LevelIndex} by {i.KuskiIndex}
        </h2>
        <div>Type: {i.BattleType}</div>
        <div>Started: {i.Started}</div>
        <div>Duration: {i.Duration}</div>
      </div>
    ))}
```

To do it the proper react way, you'll probably want to create some sub components that you serve some of this data to, so that Home.js will serve as the data component and other sub components will serve as the UI components.
