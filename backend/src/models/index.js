const Sequelize = require('sequelize');
const config = require('../../config/config.js').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = require('./user')(sequelize, Sequelize);
db.Patient = require('./patient')(sequelize, Sequelize);
db.Appointment = require('./appointment')(sequelize, Sequelize);
db.Record = require('./record')(sequelize, Sequelize);
db.Provider = require('./provider')(sequelize, Sequelize);
db.Doctor = require('./doctor')(sequelize, Sequelize);

// Associations
db.Patient.hasMany(db.Appointment, { foreignKey: 'patientId' });
db.Appointment.belongsTo(db.Patient, { foreignKey: 'patientId' });

db.Patient.hasMany(db.Record, { foreignKey: 'patientId' });
db.Record.belongsTo(db.Patient, { foreignKey: 'patientId' });

db.Provider.hasMany(db.Doctor, { foreignKey: 'providerId' });
db.Doctor.belongsTo(db.Provider, { foreignKey: 'providerId' });

module.exports = db;