require('dotenv').config()

const utf8 = require('utf8')
const WhatsApp = require('./whatsapp/functions')
const { post_msg } = require('./assets/js/utils')

function main() {
  const whatsapp = new WhatsApp()
  const allowed = process.env.CONTACTS_ALLOWED.split(',')
  whatsapp.onQR()
  whatsapp.onReady().then(() => console.log("Client is ready"))
  whatsapp.onMessage().then(async msg => {
    if (allowed.includes(msg.from)) {
      let answ = ""
      try {
        const { reply } = await post_msg({ msg: msg.body })
        try {
          answ = utf8.decode(reply)
        } catch (e) {
          answ = reply
        }
      } catch (e) {
        console.error(e)
      }
      whatsapp.send(msg.from, answ)
    }
  })
  whatsapp.init()
}

main()
