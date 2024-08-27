const DanDes = require('./models/dande.model'); 
const sequelize = require('./models/connection');


// Sync all models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables synchronized successfully.');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

module.exports = sequelize