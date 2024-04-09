"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Users", [
      {
        fullName: "Administrators",
        email: "admin@gmail.com",
        password: "123456",
        address: "Việt Nam",
        phoneNumber: "0376971481",
        gender: "1",
        image:
          "https://khanhkhiem.com/wp-content/uploads/2017/12/anh-thien-nhien-dep.jpeg",
        roleId: "Role",
        positionId: "Master",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", {}, null);
  },
};
