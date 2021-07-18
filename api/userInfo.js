const spotify = require('./api')


module.exports = () => new Promise((accept, reject) => {
  spotify()
    .getMe()
    .then(data => {
      // "Retrieved data for current user
      console.log(`Retrieved data for {${data.body.display_name}}`)
      accept(data.body)
    })
    .catch(err => {
      console.log('Something went wrong getMe:', err.message)
      reject(err)
    })
})
