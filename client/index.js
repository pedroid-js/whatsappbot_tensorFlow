(function(){
  require('dotenv').config()

  const utf8 = require('utf8')
  const WhatsApp = require('./whatsapp/functions')
  const log = require('simple-node-logger').createSimpleLogger()
  const { post_msg } = require('./assets/js/utils')

  const whatsapp = new WhatsApp()
  const allowed = process.env.CONTACTS_ALLOWED.split(',')
  whatsapp.QR()
  whatsapp.onReady().then(() => console.log("Client is ready"))
  whatsapp.onMessage(async msg => {
    const { from, body } = msg
    if (allowed.includes(from)) {
      let answ = ""
      try {
        const { reply, prob } = await post_msg({ msg: body })
        try {
          answ = utf8.decode(reply)
        } catch {
          answ = reply
        }
        log.info(
          " FROM: ", from,
          " BODY: ", body,
          " REPLY: ", answ,
          " PROB: ", prob
        )
      } catch (e) {
        log.error(e)
      }
      whatsapp.send(from, answ)
    } else {
      log.info(
        " FROM: ", from,
        " BODY: ", body
      )
    }
  })
  whatsapp.init()
})();


