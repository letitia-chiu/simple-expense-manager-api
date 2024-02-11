'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Records', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Records', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: true
    })
  }
}
