module.exports = {
  host: 'localhost',
  username: 'postgres',
  password: '1234',
  batabase: 'postgres',
  dialect: 'postgres',
  port: 5432,
  define: {
    timestamps: true,
    underscored: true,
  },
  logging: false,
  timezone: 'America/Sao_Paulo'
}

/*
module.exports={
  host:'lallah.db.elephantsql.com',
  username:'pzefoxjp',
  password:'6Ceo43gi4JjO08NOESb8z5d7dDt40JKI',
  batabase:'pzefoxjp',
  dialect:'postgres',
  define:{
      timestamps:true,
      underscored:true,
  },
  logging: false,
  timezone: 'America/Sao_Paulo'
}
*/