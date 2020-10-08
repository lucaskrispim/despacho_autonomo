const {Model,DataTypes} = require('sequelize');
const { STRING, FLOAT, UUIDV4 } = require('sequelize');

class Position extends Model{
    static init(connection){
        super.init({
            placa:DataTypes.STRING,
            latitude:DataTypes.FLOAT,
            longitude:DataTypes.FLOAT,
        },{
            tableName: 'position', 
            freezeTableName: true,
            sequelize:connection,
        })
    }
    static associate(models){
        this.belongsTo(models.Truck, {foreignKey:'id',as:'truck_id'});
    }
}

module.exports = Position;