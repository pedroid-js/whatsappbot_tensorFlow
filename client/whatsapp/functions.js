
const qrcode = require('qrcode-terminal')

class WhatsApp {
  constructor() {
    this.client = require('./client')
    this.intervals = []
  }

  init() {
    this.client.initialize()
  }

  QR() {
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

  send(to, answer) {
    this.client.sendMessage(to, answer)
  }

  sendRecurrent(to, text, time) {
    this.intervals.push({
      interval: setInterval(() => {
        this.client.sendMessage(to, text)
      }, time),
      to
    })
  }

  stopRecurrent(to) {
    this.intervals.forEach((obj, i) => {
      if (obj.to === to) {
        clearInterval(obj.interval)
        this.intervals.slice(i, 1)
      }
    })
  }

  reply(msg, body) {
    msg.reply(body)
  }
}

module.exports = WhatsApp