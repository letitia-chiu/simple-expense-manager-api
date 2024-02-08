'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Category.belongsTo(models.User, { foreignKey: userId })
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isIncome: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    underscored: true
  })
  return Category
}
