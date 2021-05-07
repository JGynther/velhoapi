const express = require("express");
const api = require("./crawler.js");

const app = express();
const port = 3000;

app.use("/", api);

app.listen(port, () => {
    console.log(`Working on port ${port}`);
})