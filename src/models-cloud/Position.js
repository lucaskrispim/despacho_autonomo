const {Model,DataTypes} = require('sequelize');
const { STRING, FLOAT, UUIDV4, BOOLEAN } = require('sequelize');

class Position extends Model{
    static init(connection){
        super.init({
            id:{type:DataTypes.UUIDV4, primaryKey:true, field:'id', defaultValue:DataTypes.UUIDV4 },
            truck_id:DataTypes.UUIDV4,
            placa:DataTypes.STRING,
            latitude:DataTypes.FLOAT,
            longitude:DataTypes.FLOAT,
            cloud:DataTypes.BOOLEAN,
        },{
            tableName: 'position', 
            freezeTableName: true,
            sequelize:connection,
        })
    }
    static associate(models){
        this.belongsTo(models.Truck, {foreignKey:'truck_id',as:'truck'});
    }
}

module.exports = Position;