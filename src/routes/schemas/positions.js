const position = {
  placa: {
    in: 'body',
    isString: true,
    isLength: {
      options: {
        min: 1,
        max: 10
      },
    },
    errorMessage: 'Campo placa inválido!',
  },
  latitude:{
    in: 'body',
    isFloat: true,
    isLength:{
      options:{
        min:1,
        max:15
      }
    },
    errorMessage: 'Campo latitude inválido!',
  },
  longitude:{
    in: 'body',
    isFloat: true,
    isLength:{
      options:{
        min:1,
        max:15,
      }
    },
    errorMessage: 'Campo longitude inválido!',
  }
}

module.exports = position;