
const qrcode = require('qrcode-terminal')

class whatsapp {
  constructor() {
    this.client = require('./client')
  }

  init() {
    this.client.initialize()
  }

  onQR() {
    this.client.on('qr', qr => qrcode.generate(qr, { small: true }))
  }

  onReady() {
    return new Promise((resolve) => {
      this.client.on('ready', resolve)
    })
  }

  onMessage(callback) {
    this.client.on('message', callback)
  }

  send(from, answer) {
    this.client.sendMessage(from, answer)
  }

  reply(msg, body) {
    msg.reply(body)
  }
}

module.exports = whatsapp