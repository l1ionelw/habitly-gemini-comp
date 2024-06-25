const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const { Sequelize, DataTypes } = require("sequelize");
const { User } = require("./db");


// init 
const express_app = express();
const port = 5001;

express_app.use(express.json());
express_app.use(cors());
express_app.use(morgan('dev'));
express_app.use(express.static("static"));

const api = require("./router");
express_app.use('/api', api);


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
express_app.get('/', (req, res) => {
    res.send('Hello World');
})

express_app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})