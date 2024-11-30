const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Users = sequelize.define('Users', {
  id_user: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
  },
  cartData: {
    type: DataTypes.JSON
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
});

module.exports = Users;