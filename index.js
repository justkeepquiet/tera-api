"use strict";

require("dotenv").config();

const express = require("express");
const morganBody = require("morgan-body");
const bodyParser = require("body-parser");

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(bodyParser.json());

if (/^true$/i.test(process.env.API_LOG)) {
	morganBody(app);
}

require("./routes/routes.index.js")(app);

app.listen(process.env.API_LISTEN_PORT, () => {
	console.log(`Application is listening at port: ${process.env.API_LISTEN_PORT}`);
});