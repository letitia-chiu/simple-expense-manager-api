'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Record.belongsTo(models.User, { foreignKey: 'userId' })
      Record.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }
  Record.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: DataTypes.INTEGER,
    isIncome: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Record',
    tableName: 'Records',
    underscored: true
  })
  return Record
}
