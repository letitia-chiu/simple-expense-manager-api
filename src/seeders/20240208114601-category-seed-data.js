'use strict'

const defaultCategories = [
  { name: 'Food' , is_income: false },
  { name: 'Transportation' , is_income: false },
  { name: 'Housewares' , is_income: false },
  { name: 'Clothes' , is_income: false },
  { name: 'Housing expense' , is_income: false },
  { name: 'Salary', is_income: true },
  { name: 'Bonus', is_income: true },
  { name: 'Investment', is_income: true }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
      defaultCategories.map(category => ({
        ...category,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
}
