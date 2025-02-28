'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('karyawan', {
      id: {
        allowNull: false,
        autoIncrement: false,
        type: Sequelize.INTEGER
      },
      nip: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      gend: {
        type: Sequelize.ENUM('L', 'P')
      },
      photo: {
        type: Sequelize.TEXT
      },
      tgl_lahir: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.INTEGER
      },
      insert_at: {
        type: Sequelize.DATE
      },
      insert_by: {
        type: Sequelize.STRING
      },
      update_at: {
        type: Sequelize.DATE
      },
      update_by: {
        type: Sequelize.STRING
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('karyawans');
  }
};