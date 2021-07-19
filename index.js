
require('dotenv').config();


(async function () {

  const fs = require('fs')
  // const getUserInfo = require('./api/userInfo')
  const getRecentlyPlayed = require('./api/recentlyPlayed')
  const getUserTopTracks = require('./api/userTopTracks')
  const getUserPlayerlists = require('./api/userPlaylists')
  const getPlaylistTracks = require('./api/playlistTracks')
  const getUserTopArtists = require('./api/userTopArtists')
  const getRecommendations = require('./api/recommendations')
  const getArtistInfo = require('./api/artistInfo')
  const _ = require('lodash')

  const pause = (index = 0) => {
    const interval = (1 + index) * (process.env.DELAY || 300)
    // console.log('delaying for', interval)
    return new Promise(accept => setTimeout(accept, interval))
  }


  const parseArtistFromTrack = require('./api/helper/getArtistsFromTrack')
  const parseArtist = require('./api/helper/getArtist')

  console.log('booting!...')

  // const userInfo = await getUserInfo()
  const recentTracks = await pause().then(() => getRecentlyPlayed())
  const userTopTracks = await pause().then(() => getUserTopTracks())
  const userTopArtists = await pause().then(() => getUserTopArtists())
  const userPlaylists = await pause().then(() => getUserPlayerlists())



  const Artists = await Promise.all([
    ..._.flatten(recentTracks.map(parseArtistFromTrack)),
    ..._.flatten(userTopTracks.map(parseArtistFromTrack)),
    ..._.flatten(userTopArtists.map(parseArtist)),
    ..._.flatten(await Promise.all(_.flatMap(userPlaylists, async (playlist, index) => {
      const trackList = await pause(index).then(() => getPlaylistTracks(playlist.id))

      return _.flatten(trackList.map(parseArtistFromTrack))
    })))
  ])


  // apend recomendations
  const recomendationsFromTopArtists = await pause().then(() => getRecommendations(userTopArtists.map(i => i.id)))
  Artists.push(..._.flatten(recomendationsFromTopArtists.map(parseArtistFromTrack)))

  const bigRecomendation = await Promise.all(_.uniqBy(Artists, 'id').map(async (artist, index) => {
    const recomendations = await pause(index).then(() => getRecommendations([artist.id]))
    return _.uniqBy(_.flatten(recomendations.map(parseArtistFromTrack)), 'id')
  }))

  const flattenBigList = await Promise.all(_.flatten(bigRecomendation).map(async (artist, index) => {
    const moreInfo = await pause(index).then(() => getArtistInfo(artist.id))
    return {
      ...artist,
      genres: moreInfo.genres,
      followers: moreInfo.followers.total,
      popularity: moreInfo.popularity,
    }
  }))

  const countList = _.countBy(flattenBigList, 'id')
  const FinalList = Object.keys(countList).map(key => {
    return {
      ...flattenBigList.find(item => item.id === key),
      count: countList[key]
    }
  })

  console.log('writing a list of Artists, found', FinalList.length)
  fs.writeFileSync('./output.json', JSON.stringify(_.sortBy(FinalList, 'count')))

})()