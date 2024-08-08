const express = require('express');
const cors = require('cors');
const morgan = require("morgan");


// init 
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.static("static"));

const api = require("./routes/router");
app.use('/api', api);


// Dates returned UTC
// let sequelize = new Sequelize({
//     dialect: "sqlite",
//     storage: './db.sqlite',
// });
//
// User.init(
//     {
//         email: { type: DataTypes.STRING, allowNull: false },
//         name: { type: DataTypes.STRING, allowNull: true },
//         timezone: { type: DataTypes.STRING, allowNull: false },
//     }, { sequelize, modelName: "users" });

const errorHandler = (err, req, res, next) => {
    err.message = err.message ? err.message : "An unknown error occurred";
    err.statusCode = err.statusCode ? err.statusCode : 404;
    console.log("CUSTOM ERROR HANDLER CAUGHT AN ERROR IN THE APPLICATION");
    console.log(err);
    return res.status(err.statusCode).send(err);
}
app.use(errorHandler);

// routes
app.get('/', (req, res) => {
    res.send('Hello World');
})

module.exports = app;