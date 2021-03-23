module.exports = {
  "CLIENT": {
    "DEFAULT": {
      "restartOnAuthFail": true,
      "puppeteer": {
        "headless": true,
        "executablePath": process.env.BROWSER_PATH,
        "args": [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu"
        ]
      }
    }
  },
  "IMAGES": {
    "DEFAULT": {
      "PATHS": [
        "./assets/img/forever_alone.png",
        "./assets/img/parejita.png",
        "./assets/img/hot.png",
        "./assets/img/timer.png",
        "./assets/img/help.png",
        "./assets/img/sex.png",
        "./assets/img/hamburguesa.png"
      ]
    }
  }
}