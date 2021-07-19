const spotify = require('./api')


module.exports = (artistId) => new Promise((accept, reject) => {
  spotify()
    .getArtist(artistId)
    .then(data => {
      console.log(`Retrieved more infor about  {${artistId}}`)

      accept(data.body)
    })
    .catch(err => {
      console.log('Something went wrong getArtist:', err.message)
      accept([])
    })
})
