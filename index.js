const express = require("express");
const api = require("./crawler.js");

const app = express();
const port = process.env.PORT || 3000;

app.use("/", api);

app.listen(port, () => {
    console.log(`Working on port ${port}`);
})