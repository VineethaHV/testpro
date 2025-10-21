module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    doctor: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    reason: { type: DataTypes.STRING },
    status: { 
      type: DataTypes.ENUM('scheduled', 'cancelled', 'completed'), 
      allowNull: false, 
      defaultValue: 'scheduled' 
    },
    timeSlot: { type: DataTypes.STRING, allowNull: false } // e.g. "09:00-09:30"
  });
  return Appointment;
};