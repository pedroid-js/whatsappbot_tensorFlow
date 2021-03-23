const { Client } = require('whatsapp-web.js')

const {
  CLIENT: {
    DEFAULT: OPTIONS
  }
} = require('../config')

const client = new Client(OPTIONS)

module.exports = client