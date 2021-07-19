const spotify = require('./api')


module.exports = () => new Promise((accept, reject) => {
  spotify()
    .getUserPlaylists()
    .then(data => {
      console.log(`Retrieved user playlists. got {${data.body.items.length}} playlists`)

      accept(data.body.items)
    })
    .catch(err => {
      console.log('Something went wrong getUserPlaylists:', err.message)
      accept([])
    })
})
