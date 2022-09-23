const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "UsersRol",
    {
      id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      RolId:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
      },
      UserId:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
      }
      },
    {
      timestamps: false,
      freezeTableName: true, 
    }
  );
};