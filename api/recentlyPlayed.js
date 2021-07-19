const spotify = require('./api')


module.exports = () => new Promise((accept, reject) => {
  spotify()
    .getMyRecentlyPlayedTracks({ limit: process.env.LIMIT })
    .then(data => {
      console.log(`Retrieved recently played tracks.  got {${data.body.items.length}} tracks`)
      accept(data.body.items.map(i => i.track))
    })
    .catch(err => {
      console.log('Something went wrong getMyRecentlyPlayedTracks:', err.message)
      accept([])
    })
})
