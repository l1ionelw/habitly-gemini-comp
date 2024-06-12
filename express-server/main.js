const express = require('express');
const { Sequelize, DataTypes } = require("sequelize");
const { User } = require("./db");


// init 
const app = express();
const port = 5001;

app.use(express.json());
//app.use(cors());
app.use(express.static("static"));

const api = require("./router");
app.use('/api', api);


// Dates returned UTC
let sequelize = new Sequelize({
    dialect: "sqlite",
    storage: './db.sqlite',
});

User.init(
    {
        email: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: true },
        timezone: { type: DataTypes.STRING, allowNull: false },
    }, { sequelize, modelName: "users" });

// routes
app.get('/', (req, res) => {
    res.send('Hello World');
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})