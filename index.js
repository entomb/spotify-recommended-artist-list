
require('dotenv').config();


(async function () {

  const fs = require('fs')
  const getUserInfo = require('./api/userInfo')
  const getRecentlyPlayed = require('./api/recentlyPlayed')
  const getUserTopTracks = require('./api/userTopTracks')
  const getUserPlayerlists = require('./api/userPlaylists')
  const getPlaylistTracks = require('./api/playlistTracks')
  const getUserTopArtists = require('./api/userTopArtists')
  const getRecommendations = require('./api/recommendations')
  const _ = require('lodash')

  const pause = () => new Promise(accept => setTimeout(accept, 300))


  const parseArtistFromTrack = require('./api/helper/getArtistsFromTrack')
  const parseArtist = require('./api/helper/getArtist')

  console.log('booting!...')

  const userInfo = await getUserInfo()
  const recentTracks = await pause().then(() => getRecentlyPlayed())
  const userTopTracks = await pause().then(() => getUserTopTracks())
  const userTopArtists = await pause().then(() => getUserTopArtists())
  const userPlaylists = await pause().then(() => getUserPlayerlists())



  const Artists = await Promise.all([
    ..._.flatten(recentTracks.map(parseArtistFromTrack)),
    ..._.flatten(userTopTracks.map(parseArtistFromTrack)),
    ..._.flatten(userTopArtists.map(parseArtist)),
    ..._.flatten(await Promise.all(_.flatMap(userPlaylists, async playlist => {
      const trackList = await getPlaylistTracks(playlist.id)
      await pause() // prevent agressive quering

      return _.flatten(trackList.map(parseArtistFromTrack))
    })))
  ])


  // apend recomendations
  const recomendationsFromTopArtists = await pause().then(() => getRecommendations(userTopArtists.map(i => i.id)))
  Artists.push(..._.flatten(recomendationsFromTopArtists.map(parseArtistFromTrack)))

  const bigRecomendation = await Promise.all(_.uniqBy(Artists, 'id').map(async artist => {
    const recomendations = await pause().then(() => getRecommendations([artist.id]))
    return _.uniqBy(_.flatten(recomendations.map(parseArtistFromTrack)), 'id')
  }))

  const flaatenBigList = _.flatten(bigRecomendation)
  const countList = _.countBy(flaatenBigList, 'id')
  const FinalList = Object.keys(countList).map(key => {
    return {
      ...flaatenBigList.find(item => item.id === key),
      count: countList[key]
    }
  })

  console.log('writing a list of Artists, fount', FinalList.length)
  fs.writeFileSync('./output.json', JSON.stringify(_.sortBy(FinalList, 'count')))

})()