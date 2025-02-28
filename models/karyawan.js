'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Karyawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Karyawan.init({
    nip: DataTypes.STRING,
    nama: DataTypes.STRING,
    alamat: DataTypes.STRING,
    gend: DataTypes.ENUM('L', 'P'),
    photo: DataTypes.TEXT,
    tgl_lahir: DataTypes.DATE,
    status: DataTypes.INTEGER,
    insert_at: DataTypes.DATE,
    insert_by: DataTypes.STRING,
    update_at: DataTypes.DATE,
    update_by: DataTypes.STRING,


  }, {
    sequelize,
    modelName: 'Karyawan',
    tableName: 'karyawan',
    timestamps: false,
    noPrimaryKey: true
  });
  return Karyawan;
};