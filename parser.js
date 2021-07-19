const fs = require('fs')
const _ = require('lodash')
const numWords = require('num-words')

const data = JSON.parse(Buffer.from(fs.readFileSync('./output.json'), 'utf-8'))


// const genres = _.uniq(_.flatten(data.map(artist => artist.genres)))
// console.log(genres)

const WhitelistGenres = [
  'art',
  'stoner',
  'trip hop',
  'triphop',
  'classical',
  'portuguesa',
  'portuguese',
  'fado',
  'rock',
  'alternative',
  'grunge',
  'indie',
  'metal',
  'punk',
  'doom',
  'new age',
  'folk',
  'viking',
  'progressive',
  'ambient',
  'atmospheric',
  'gothic',
  'glam',
  'jazz',
  'lounge',
  'thrash',
  'orchestra',
  'fusion',
  'celtic',
  'death',
  'soul',
  'vintage',
  'folclore',
  'folklore',
  'pirate',
  'djent',
  'nu'
]

const filterWhitelistGenres = (artist) => {
  const genreStr = artist.genres.join()
  return WhitelistGenres.some(word => {
    return genreStr.includes(word)
  })
}

const filterLowPopularity = (artist) => {
  if (artist.count > 3) return true
  return artist.popularity < 75 ? artist.followers.total > 999 : true
}

const filterWeirdNames = (artist) => {
  var countAlphanum = (artist.name.match(/[a-zA-Z0-9]/g) || []).length;
  return countAlphanum > (artist.name.length / 2)
}

const filterNonAlphanumFirstLetter = (artist) => {
  const fistLetter = artist.name.charAt(0)
  return fistLetter.match(/[a-zA-Z0-9]/g).length > 0
}


const parsedData = data
  .filter(filterWhitelistGenres)
  .filter(filterLowPopularity)
  .filter(filterWeirdNames)
  .filter(filterNonAlphanumFirstLetter)
  .map(i => i.name)
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))

const groupedByFirstChar = _.groupBy(parsedData, name => name.charAt(0).toUpperCase())

// fix numbers 
Object.keys(groupedByFirstChar) // get all the keys
  .filter(w => w.match(/[a-zA-Z]/g) === null) // filter by non A-Z
  .forEach(key => {
    const list = groupedByFirstChar[key];
    list.forEach(name => {
      const num = name.match(/^(\d+)/).shift() // get the number
      const firstChar = numWords(num).charAt(0).toUpperCase() // try to fetch first char of numWords()
      if (_.has(groupedByFirstChar, firstChar)) { // push to the right Letter
        groupedByFirstChar[firstChar].push(name)
      } else {
        groupedByFirstChar[firstChar] = [name]
      }
    })
    delete groupedByFirstChar[key];
  })

// fixes "the"
groupedByFirstChar.T = groupedByFirstChar.T.filter((name) => {
  const firstWord = (name.match(/^(\w+)/) || null).shift() // get first word
  if (firstWord.toUpperCase() === 'THE') { // if its a "the"
    const fistLetter = name.charAt(4) // use the next first letter
    groupedByFirstChar[fistLetter].push(name) // push to the right Letter
    return false // remove from T list
  }
  return true
})

console.log(groupedByFirstChar)
fs.writeFileSync('./artists.json', JSON.stringify(groupedByFirstChar))