const express = require('express');
const path = require('path');
var cors = require("cors");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();


const sequelize = require('./create.table');



const indexRouter = require('./routes/index');
const app = express();

global.__basedir = __dirname;

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/api', indexRouter);


module.exports = app;
