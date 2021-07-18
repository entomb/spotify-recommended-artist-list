const SpotifyWebApi = require('spotify-web-api-node');

/**
 * This example retrieves information about the 'current' user. The current user is the user that has
 * authorized the application to access its data.
 */

/* Retrieve a code as documented here:
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
 *
 * Codes are given for a set of scopes. For this example, the scopes are user-read-private and user-read-email.
 * Scopes are documented here:
 * https://developer.spotify.com/documentation/general/guides/scopes/
 */
const accessToken = process.env.ACCESS_TOKEN

/* Get the credentials from Spotify's Dashboard page.
 * https://developer.spotify.com/dashboard/applications
 */
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CLIENT_REDIRECT_URI
});

spotifyApi.setAccessToken(accessToken);

module.exports = () => spotifyApi