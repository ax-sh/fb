module.exports = {
  name: 'login',
  alias: 'l',
  run: async function(toolbox) {
    const { system, print, filesystem, strings } = toolbox
    const tokens = await toolbox.facebook.login()

    // // ...and be the CLI you wish to see in the world
    // const awesome = strings.trim(await system.run('whoami'))
    // // const moreAwesome = strings.kebabCase(`${awesome} and a keyboard`)

    const home = process.env['HOME']
    filesystem.write(`${home}/facebook-scraper.json`, { tokens })

    print.info(tokens)
    // print.warning(`${print.checkmark} Altius`)
    // print.success(`${print.checkmark} Fortius`)
  }
}
