import { GluegunToolbox } from 'gluegun'

const chromeCookies = require('chrome-cookies-secure')
const puppeteer = require('puppeteer')

class Facebook {
  DOMAIN = 'facebook.com'
  URL = `https://${this.DOMAIN}`

  getPuppeteerCookies(profile?) {
    return new Promise<any>((resolve, reject) => {
      const cb = (err, cookies) => {
        if (err) {
          return reject(err)
        }
        return resolve(cookies)
      }
      chromeCookies.getCookies(this.URL, 'puppeteer', cb, profile) // e.g. 'Profile 2'
    })
  }

  async getBrowser() {
    const headless = true
    const devtools = !headless
    return puppeteer.launch({
      headless,
      devtools
    })
  }

  async getAsyncToken(cookies) {
    return new Promise(async (resolve, reject) => {
      const browser = await this.getBrowser()

      const process = async page => {
        await page.waitForTimeout(1000)

        const tokens = await page.evaluate(() => {
          return require('DTSGInitData')
        })
        resolve(tokens)
      }

      try {
        const page = await browser.newPage()

        await page.setCookie(...cookies)
        await page.goto(this.URL)
        await process(page)
      } catch (e) {
        reject(e)
      } finally {
        await browser.close()
      }
    })
  }

  async login(profile?) {
    const cookies = await this.getPuppeteerCookies(profile)
    const tokens = await this.getAsyncToken(cookies)
    return tokens
  }
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.chromeCookies = chromeCookies
  toolbox.puppeteer = puppeteer
  toolbox.facebook = new Facebook()

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "fb" property),
  // fb.config.json, etc.
  toolbox.config = {
    ...toolbox.config,
    ...toolbox.config.loadConfig('fb', process.cwd())
  }
}
