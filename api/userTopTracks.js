const spotify = require('./api')


module.exports = () => new Promise((accept, reject) => {
  spotify()
    .getMyTopTracks({ limit: process.env.LIMIT })
    .then(data => {
      console.log(`Retrieved top tracks.  got {${data.body.items.length}} tracks`)

      accept(data.body.items)
    })
    .catch(err => {
      console.log('Something went wrong getMyTopTracks:', err.message)
      accept([])
    })
})
