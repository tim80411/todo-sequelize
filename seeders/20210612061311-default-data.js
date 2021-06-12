'use strict';
const bcrypt = require('bcryptjs');
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(SEED_USER.password, salt)

      const userId = await queryInterface.bulkInsert('Users', [{
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})

      await queryInterface.bulkInsert('Todos',
        Array.from({ length: 10 }).map((_, i) =>
        ({
          name: `name-${i}`,
          UserId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})

    } catch (error) {
      console.error(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Todos', null, {})
      await queryInterface.bulkDelete('Users', null, {})
    } catch (error) {
      console.error(error)
    }
  }
}
