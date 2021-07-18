const spotify = require('./api')


module.exports = (playlistId) => new Promise((accept, reject) => {
  spotify()
    .getPlaylistTracks(playlistId, { limit: process.env.LIMIT })
    .then(data => {
      console.log(`Retrieved tracklist for ${playlistId}.  got {${data.body.items.length}} tracks`)

      accept(data.body.items.map(i => i.track))
    })
    .catch(err => {
      console.log('Something went wrong getPlaylistTracks:', err.message)
      reject(err)
    })
})
