"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Tasks, { foreignKey: "userId" });
      // define association here
    }
  }
  Users.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );

  function generateHash(user) {
    if (user === null) {
      throw new Error("generateHash -> User not found");
    } else if (!user.changed("password")) return user.password;
    else {
      let salt = bcrypt.genSaltSync();
      return (user.password = bcrypt.hashSync(user.password, salt));
    }
  }
  Users.beforeCreate(generateHash);
  Users.beforeUpdate(generateHash);
  Users.prototype.generatePassChangeHash = function (newPassword) {
    let salt = bcrypt.genSaltSync();
    const newPass = bcrypt.hashSync(newPassword, salt);
    return JSON.stringify(newPass);
  };
  Users.prototype.validPassword = async function (password) {
    let verif;
    try {
      verif = await bcrypt.compare(password, this.password);
    } catch (err) {
      console.error(err);
      return err;
    }
    return verif;
  };

  return Users;
};
