const {Model,DataTypes} = require('sequelize');
const { STRING, FLOAT, UUIDV4, BOOLEAN, DATE } = require('sequelize');

class Position extends Model{
    static init(connection){
        super.init({
            id:{type:DataTypes.UUIDV4, primaryKey:true, field:'id', defaultValue:DataTypes.UUIDV4 },
            truck_id:DataTypes.UUIDV4,
            placa:DataTypes.STRING,
            latitude:DataTypes.FLOAT,
            longitude:DataTypes.FLOAT,
            cloud:DataTypes.BOOLEAN,
            createdAt: { type: DataTypes.DATE, field: 'created_at' },
            updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
        },{
            tableName: 'position', 
            freezeTableName: true,
            sequelize:connection,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        })
    }
    static associate(models){
        this.belongsTo(models.Truck, {foreignKey:'truck_id',as:'truck'});
    }
}

module.exports = Position;