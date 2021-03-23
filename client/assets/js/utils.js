const fetch = require('node-fetch')

async function post_msg(msg){
  const response = await fetch(process.env.BOT_API, {
    method: "POST",
    body: JSON.stringify(msg),
    headers: {
       'Content-Type': 'application/json' 
    }
  })
  return response.json()
}

module.exports = {
  post_msg
}