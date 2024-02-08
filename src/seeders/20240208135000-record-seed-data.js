'use strict'

const initialData = [
  {
    title: 'Salary of January',
    amount: 60000,
    is_income: true,
    category_id: 6
  },
  {
    title: 'Coffee',
    amount: 45,
    is_income: false,
    category_id: 1
  },
  {
    title: 'T-shirt',
    amount: 390,
    is_income: false,
    category_id: 4
  },
  {
    title: 'EZcard charge',
    amount: 500,
    is_income: false,
    category_id: 2
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Records',
      initialData.map(data => ({
        ...data,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Records', {})
  }
}
