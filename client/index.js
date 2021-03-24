require('dotenv').config()

const utf8 = require('utf8')
const WhatsApp = require('./whatsapp/functions')
const { post_msg } = require('./assets/js/utils')
const log = require('simple-node-logger').createSimpleLogger();

function main() {
  const whatsapp = new WhatsApp()
  const allowed = process.env.CONTACTS_ALLOWED.split(',')
  whatsapp.onQR()
  whatsapp.onReady().then(() => console.log("Client is ready"))
  whatsapp.onMessage(async msg => {
    const { from, body } = msg
    if (allowed.includes(from)) {
      let answ = ""
      try {
        const { reply, prob } = await post_msg({ msg: body })
        try {
          answ = utf8.decode(reply)
        } catch (e) {
          answ = reply
        }
        log.info(
          " FROM: ", from,
          " BODY: ", body,
          " REPLY: ", reply,
          " PROB: ", prob
        )
      } catch (e) {
        console.error(e)
      }
      whatsapp.send(from, answ)
    }
  })
  whatsapp.init()
}

main()
