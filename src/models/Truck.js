const {Model,DataTypes} = require('sequelize');
const { STRING } = require('sequelize');

class Truck extends Model{
    static init(connection){
        super.init({
            placa:DataTypes.STRING
        },{
            tableName: 'truck', 
            freezeTableName: true,
            sequelize:connection,
        })
    }
}

module.exports = Truck;