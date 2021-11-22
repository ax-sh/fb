module.exports = {
  name: 'saved-items',
  alias: 's',
  run: async function(toolbox) {
    const { system, print, filesystem, strings } = toolbox
    // const tokens = await toolbox.facebook.login()
    const home = process.env['HOME']
    const { tokens } = JSON.parse(
      filesystem.read(`${home}/facebook-scraper.json`)
    )

    print.info(tokens)

  }
}
