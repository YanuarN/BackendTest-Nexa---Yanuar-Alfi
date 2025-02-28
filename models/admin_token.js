'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admin_token.init({
    id_admin: DataTypes.INTEGER,
    token: DataTypes.TEXT,
    expired_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'admin_token',
    tableName: 'admin_token',
    timestamps: false
  });
  return admin_token;
};