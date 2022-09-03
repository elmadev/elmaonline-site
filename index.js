import express from "express";
const port = 3003;
const app = express();

app.get("/", (req, res) => {
  res.send("Successful response.");
});

app.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`Example app is listening on port ${port}.`)
);
