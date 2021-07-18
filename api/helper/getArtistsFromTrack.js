const _ = require('lodash')
const parseArtist = require('./getArtist')

module.exports = (trackObject) => {
  return _.flatten([
    ...trackObject.artists,
    ...trackObject.album.artists
  ]).map(parseArtist)
}