const Product = require('../models/Product')

module.exports = {
  /* Retorna todos os produtos que contém a pesquisa feita pelo usuário e a informação do mercado */
  async index(req, res) {
    const search = req.headers.search

    await Product.find({product_name: search}).populate({path: 'market_id', select: 'market_name'})
    .exec(function (err, product) {
      if (err) return console.log(err)
      return res.json(product)
    })
    
    
  }
}