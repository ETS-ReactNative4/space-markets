const fs = require('mz/fs')
const User = require('../models/User')
const cloudinary = require('../config/cloudinaryConfig')

module.exports = {
  async index(req, res) {
    const auth = req.headers.auth

    await User.findOne({user_mail: auth}, async function(err, data) {
      if(err) { return console.log(err) }
      return res.json(data)
    })
  },

  async create(req, res) {
    const { user_name, user_mail, user_cpf, user_password, user_picture } = req.body

    const user_profile_picture = new Buffer.from(user_picture.split(",")[1],"base64")

    const url = await cloudinary.v2.uploader.upload(user_picture).then((res) => {
      return res.secure_url
    })

    const user = await User.create({
      user_name,
      user_mail,
      user_cpf,
      user_password,
      user_profile_picture,
      user_profile_picture_url: url
    })
    
    await fs.writeFile(`../backend/tmp/uploads/user/${user._id}.png`, user.user_profile_picture)
    //await fs.writeFile(`../mobile/src/tmp/uploads/${user._id}.png`, user.user_profile_picture)
    
    return res.json(user)
  }
}