const spotify = require('./api')


module.exports = () => new Promise((accept, reject) => {
  spotify()
    .getMyTopArtists({ limit: process.env.LIMIT })
    .then(data => {
      console.log(`Retrieved top artists.  got {${data.body.items.length}} artists`)

      accept(data.body.items)
    })
    .catch(err => {
      console.log('Something went wrong getMyTopArtists:', err.message)
      accept([])
    })
})
