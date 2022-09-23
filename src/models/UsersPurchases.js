const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "UserPurchases",
    {
      id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserId:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
      },
      PurchasesId:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
      }
      },
    {
      freezeTableName: true, 
    }
  );
};