"use strict";
const fs = require("fs");
const path = require("path");

const Sequelize = require("sequelize");
const basename = path.basename(__filename);
let models = {};

var pg = require("pg");
pg.defaults.ssl = true;
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: true,
    dialect: "postgres",
    /* disable logging to console */
    logging: function (str) {},
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    models[model.name] = model;
  });
/**
 * loop through & associate all Sequelize models if needed
 */
Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});
models.sequelize = sequelize;
models.op = sequelize.Op;
module.exports = models;
