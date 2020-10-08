const truckCreate = {
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
  }
}

const truckModify = {
  id: {
    in: 'body',
    isUUID: true,
    errorMessage: 'Campo id inválido!',
  },
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
  }
}


module.exports = {truckCreate,truckModify};