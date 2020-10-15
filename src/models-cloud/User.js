const {Model,DataTypes} = require('sequelize');
const { STRING, BOOLEAN, UUIDV4 } = require('sequelize');

class User extends Model{
    static init(connection){
        super.init({
            id:{ type:DataTypes.UUIDV4, primaryKey:true, field:'id', defaultValue:DataTypes.UUIDV4 },
            name:DataTypes.STRING,
            username:DataTypes.STRING,
            password:DataTypes.STRING,
            salt:DataTypes.STRING,
            email:DataTypes.STRING,
            adm:DataTypes.BOOLEAN,
            cloud:DataTypes.BOOLEAN,
        },{
            tableName: 'user', 
            freezeTableName: true,
            sequelize:connection,
        })
    }
}

module.exports = User;