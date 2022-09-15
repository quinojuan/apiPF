const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "ProductsColors",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      productsId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false,
      },
      colorsId:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false,
      },
      url:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,  
      }
      },
    {
      freezeTableName: true, 
    }
  );
};