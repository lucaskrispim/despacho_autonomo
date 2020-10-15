const {Model,DataTypes} = require('sequelize');
const { STRING } = require('sequelize');

class Truck extends Model{
    static init(connection){
        super.init({
            id:{ type:DataTypes.UUIDV4, primaryKey:true, field:'id', defaultValue:DataTypes.UUIDV4 },
            placa:DataTypes.STRING,
            cloud:DataTypes.BOOLEAN,
        },{
            tableName: 'truck', 
            freezeTableName: true,
            sequelize:connection,
        })
    }
}

module.exports = Truck;