const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Checkout",
    {
      id:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      transaction :{
        type: DataTypes.STRING,
        allowNull: false
      },
      amount:{
        type: DataTypes.STRING,
        allowNull: false
      },
      status:{
        type: DataTypes.STRING,
        allowNull: false
      }
      },
    {
      freezeTableName: true, 
    }
  );
};