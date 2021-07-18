const spotify = require('./api')


module.exports = (ArtistIds) => new Promise((accept, reject) => {
  spotify()
    .getRecommendations({ seed_artists: ArtistIds, min_popularity: 30, limit: process.env.LIMIT })
    .then(data => {
      console.log(`Retrieved recommendations from seed ${ArtistIds.join(',')}. got {${data.body.tracks.length}} items`)

      accept(data.body.tracks)
    })
    .catch(err => {
      console.log('Something went wrong getRecommendations:', err.message)
      reject(err)
    })
})
