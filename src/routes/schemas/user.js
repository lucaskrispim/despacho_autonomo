const userCreate = {
  name: {
    in: 'body',
    isString: true,
    isLength: {
      options: {
        min: 1,
        max: 100
      },
    },
    errorMessage: 'Campo nome inválido!',
  },
  username: {
    in: 'body',
    isString: true,
    isLength: {
      options: {
        min: 1,
        max: 100
      },
    },
    errorMessage: 'Campo username inválido!',
  },
  password: {
    in: 'body',
    isString: true,
    isLength: {
      options: {
        min: 1,
        max: 100
      },
    },
    errorMessage: 'Campo password inválido!',
  },
  email: {
    in: 'body',
    isEmail: true,
    isLength: {
      options: {
        min: 1,
        max: 100
      },
    },
    errorMessage: 'Campo email inválido!',
  },
  adm: {
    in: 'body',
    isBoolean: true,
    errorMessage: 'Campo adm inválido!',
  }
}

module.exports = {userCreate};