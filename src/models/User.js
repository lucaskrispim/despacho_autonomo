const {Model,DataTypes} = require('sequelize');
const { STRING, BOOLEAN } = require('sequelize');

class User extends Model{
    static init(connection){
        super.init({
            name:DataTypes.STRING,
            username:DataTypes.STRING,
            password:DataTypes.STRING,
            salt:DataTypes.STRING,
            email:DataTypes.STRING,
            adm:DataTypes.BOOLEAN,
        },{
            tableName: 'user', 
            freezeTableName: true,
            sequelize:connection,
        })
    }
}

module.exports = User;