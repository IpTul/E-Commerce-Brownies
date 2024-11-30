const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('brownies', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;