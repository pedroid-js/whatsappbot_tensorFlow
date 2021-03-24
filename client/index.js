(function () {
  require('dotenv').config()

  const utf8 = require('utf8')
  const WhatsApp = require('./whatsapp/functions')
  const log = require('simple-node-logger').createSimpleLogger()
  const { post_msg, hasEmoji } = require('./assets/js/utils')

  const whatsapp = new WhatsApp()
  const allowed = process.env.CONTACTS_ALLOWED.split(',')
  whatsapp.QR()
  whatsapp.onReady().then(() => log.info("Client is ready"))
  whatsapp.onMessage(async msg => {
    let { from, body } = msg
    if (allowed.includes(from)) {
      let answ = ""
      try {
        const { 
          reply,
          prob, 
          failureThreshold
        } = await post_msg({ msg: body })
        try {
          answ = utf8.decode(reply)
        } catch {
          answ = reply
        }
        if (prob < failureThreshold && hasEmoji(body)) {
          answ = body
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


