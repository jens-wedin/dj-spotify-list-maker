Web API Changelog - February 2026
Overview
These changes are related to this blog post. The changes are categorised by endpoints (removed, changed, or added), and then by fields on the different content types (track, playlist, chapter, etc.) Lastly you find a list with all endpoints still available, but field and behavioral changes mentioned earlier still apply.

Changes to endpoints
The following changes have been made to the endpoints.

[REMOVED] Create Playlist for user (POST /users/{user_id}/playlists) - Create a playlist for a Spotify user.
Use POST /me/playlists instead
[REMOVED] Get Artist's Top Tracks (GET /artists/{id}/top-tracks) – Get Spotify catalog information about an artist's top tracks by country.
[REMOVED] Get Available Markets (GET /markets) – Get the list of markets where Spotify is available.
[REMOVED] Get New Releases (GET /browse/new-releases) – Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
[REMOVED] Get Several Albums (GET /albums) – Get Spotify catalog information for multiple albums identified by their Spotify IDs.
[REMOVED] Get Several Artists (GET /artists) – Get Spotify catalog information for several artists based on their Spotify IDs.
[REMOVED] Get Several Audiobooks (GET /audiobooks) – Get Spotify catalog information for several audiobooks identified by their Spotify IDs.
[REMOVED] Get Several Browse Categories (GET /browse/categories) – Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
[REMOVED] Get Several Chapters (GET /chapters) – Get Spotify catalog information for several audiobook chapters identified by their Spotify IDs.
[REMOVED] Get Several Episodes (GET /episodes) – Get Spotify catalog information for several episodes based on their Spotify IDs.
[REMOVED] Get Several Shows (GET /shows) – Get Spotify catalog information for several shows based on their Spotify IDs.
[REMOVED] Get Several Tracks (GET /tracks) – Get Spotify catalog information for multiple tracks based on their Spotify IDs.
[REMOVED] Get Single Browse Category (GET /browse/categories/{id}) – Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
[REMOVED] Get User's Playlists (GET /users/{id}/playlists) – Get a list of the playlists owned or followed by a Spotify user.
[REMOVED] Get User's Profile (GET /users/{id}) – Get public profile information about a Spotify user.
[ADDED] Remove from Library (DELETE /me/library) – Remove a list of Spotify URIs from the user's library.
[REMOVED] Remove Albums for Current User (DELETE /me/albums) – Removes albums from the user's library.
Use DELETE /me/library instead
[REMOVED] Remove Audiobooks for Current User (DELETE /me/audiobooks) – Removes audiobooks from the user's library.
Use DELETE /me/library instead
[REMOVED] Remove Episodes for Current User (DELETE /me/episodes) – Removes episodes from the user's library.
Use DELETE /me/library instead
[REMOVED] Remove Shows for Current User (DELETE /me/shows) – Removes shows from the user's library.
Use DELETE /me/library instead
[REMOVED] Remove Tracks for Current User (DELETE /me/tracks) – Removes tracks from the user's library.
Use DELETE /me/library instead
[ADDED] Save to Library (PUT /me/library) – Save a list of Spotify URIs to the user's library.
[REMOVED] Save Albums for Current User (PUT /me/albums) – Saves one or more albums to the user's library.
Use PUT /me/library instead
[REMOVED] Save Audiobooks for Current User (PUT /me/audiobooks) – Saves audiobooks to the user's library.
Use PUT /me/library instead
[REMOVED] Save Episodes for Current User (PUT /me/episodes) – Saves episodes to the user's library.
Use PUT /me/library instead
[REMOVED] Save Shows for Current User (PUT /me/shows) – Saves shows to the user's library.
Use PUT /me/library instead
[REMOVED] Save Tracks for Current User (PUT /me/tracks) – Saves tracks to the user's library.
Use PUT /me/library instead
[ADDED] Check User's Saved Items (GET /me/library/contains) – Check if one or more items are already saved in the current user's library.
[REMOVED] Check If User Follows Artists or Users (GET /me/following/contains) – Check to see if the current user is following one or more artists or other Spotify users.
Use GET /me/library/contains instead
[REMOVED] Check if Current User Follows Playlist (GET /playlists/{id}/followers/contains) – Checks whether the current user follows a given playlist.
Use GET /me/library/contains instead
[REMOVED] Check User's Saved Albums (GET /me/albums/contains) – Checks whether one or more album IDs are saved in the current user's library.
Use GET /me/library/contains instead
[REMOVED] Check User's Saved Audiobooks (GET /me/audiobooks/contains) – Checks whether one or more audiobook IDs are saved in the current user's library.
Use GET /me/library/contains instead
[REMOVED] Check User's Saved Episodes (GET /me/episodes/contains) – Checks whether one or more episode IDs are saved in the current user's library.
Use GET /me/library/contains instead
[REMOVED] Check User's Saved Shows (GET /me/shows/contains) – Checks whether one or more show IDs are saved in the current user's library.
Use GET /me/library/contains instead
[REMOVED] Check User's Saved Tracks (GET /me/tracks/contains) – Checks whether one or more track IDs are saved in the current user's library.
Use GET /me/library/contains instead
[REMOVED] Follow Artists or Users (PUT /me/following) – Follows one or more artists or users.
Use PUT /me/library instead
[REMOVED] Follow Playlist (PUT /playlists/{id}/followers) – Follows a playlist on behalf of the current user.
Use PUT /me/library instead
[REMOVED] Unfollow Artists or Users (DELETE /me/following) – Unfollows one or more artists or users.
Use DELETE /me/library instead
[REMOVED] Unfollow Playlist (DELETE /playlists/{id}/followers) – Unfollows a playlist on behalf of the current user.
Use DELETE /me/library instead
[ADDED] Add Items to Playlist (POST /playlists/{id}/items) – Add one or more items to a user's playlist.
[ADDED] Get Playlist Items (GET /playlists/{id}/items) – Get full details of the items of a playlist.
[ADDED] Remove Playlist Items (DELETE /playlists/{id}/items) – Remove one or more items from a user's playlist.
[ADDED] Update Playlist Items (PUT /playlists/{id}/items) – Either reorder or replace items in a playlist.
[REMOVED] Add Items to Playlist (POST /playlists/{id}/tracks) – Adds tracks or episodes to a playlist.
Use POST /playlists/{id}/items instead
[REMOVED] Get Playlist Items (GET /playlists/{id}/tracks) – Retrieves the tracks or episodes in a playlist.
Use GET /playlists/{id}/items instead
[REMOVED] Remove Playlist Items (DELETE /playlists/{id}/tracks) – Removes tracks or episodes from a playlist.
Use DELETE /playlists/{id}/items instead
[REMOVED] Update Playlist Items (PUT /playlists/{playlist_id}/tracks) – Either reorder or replace items in a playlist.
Use PUT /playlists/{id}/items instead
[CHANGED] Search for Item (GET /search) – The limit parameter maximum value has been reduced from 50 to 10, and the default value has been changed from 20 to 5.
Changes to fields
The following content types and their objects are present in most responses - these changes apply for their occurances in all responses.

Album
[REMOVED] album_group - Describes the relationship between the artist and the album
[REMOVED] available_markets – The markets in which the album is available: ISO 3166-1 alpha-2 country codes.
[REMOVED] external_ids — Known external IDs for the album.
[REMOVED] label – The label associated with the album.
[REMOVED] popularity — The popularity of the album. The value will be between 0 and 100, with 100 being the most popular.
Artist
[REMOVED] followers — Information about the followers of the artist.
[REMOVED] popularity — The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist's popularity is calculated from the popularity of all the artist's tracks.
Audiobook
[REMOVED] available_markets – A list of the countries in which the audiobook can be played, identified by their ISO 3166-1 alpha-2 code.
[REMOVED] publisher – The publisher of the audiobook.
Chapter
[REMOVED] available_markets – A list of the countries in which the audiobook can be played, identified by their ISO 3166-1 alpha-2 code.
Playlist
Will only return an items object for the user's playlist, other playlists will only provide metadata (not the contents of the playlist) in the response.

[RENAMED] tracks -> items
[RENAMED] tracks.tracks -> items.items
[RENAMED] tracks.tracks.track -> items.items.item
Show
[REMOVED] available_markets – A list of the countries in which the show can be played, identified by their ISO 3166-1 alpha-2 code.
[REMOVED] publisher – The publisher of the show.
Track
[REMOVED] available_markets – A list of the countries in which the track can be played, identified by their ISO 3166-1 alpha-2 code.
[REMOVED] external_ids — Known external IDs for the track.
[REMOVED] linked_from – Original track when relinked.
[REMOVED] popularity — The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.
User
[REMOVED] country – The country of the user, as set in the user's account profile. An ISO 3166-1 alpha-2 country code.
[REMOVED] email – The user's email address, as entered by the user when creating their account.
[REMOVED] explicit_content – The user's explicit content settings.
[REMOVED] followers — Information about the followers of the user.
[REMOVED] product – The user's Spotify subscription level: "premium", "free", etc. (The subscription level "open" can be considered the same as "free".)
Endpoints still available
These endpoints remain available, but the changes mentioned above still apply to them.

Library
Change Playlist Details (PUT /playlists/{id}) – Updates a playlist's name, description, or visibility.
Create Playlist (POST /me/playlists) – Creates a new playlist for logged in users.
Get Current User's Playlists (GET /me/playlists) – Retrieves playlists for the current authenticated user.
Get Followed Artists (GET /me/following) – Retrieves artists followed by the current user.
Get User's Saved Albums (GET /me/albums) – Retrieves albums saved in the user's library.
Get User's Saved Audiobooks (GET /me/audiobooks) – Retrieves audiobooks saved in the user's library.
Get User's Saved Episodes (GET /me/episodes) – Retrieves podcast episodes saved in the user's library.
Get User's Saved Shows (GET /me/shows) – Retrieves podcast shows saved in the user's library.
Get User's Saved Tracks (GET /me/tracks) – Retrieves tracks saved in the user's library.
Remove from Library (DELETE /me/library) – Remove a list of Spotify URIs from the user's library.
Save to Library (PUT /me/library) – Save a list of Spotify URIs to the user's library.
Metadata
Get Album (GET /albums/{id}) – Retrieves detailed metadata for a single album.
Get Album Tracks (GET /albums/{id}/tracks) – Retrieves the tracks contained in a specific album.
Get Artist (GET /artists/{id}) – Retrieves detailed metadata for a single artist.
Get Artist's Albums (GET /artists/{id}/albums) – Retrieves albums released by a specific artist.
Get Audiobook (GET /audiobooks/{id}) – Retrieves detailed metadata for a single audiobook.
Get Audiobook Chapters (GET /audiobooks/{id}/chapters) – Retrieves chapters belonging to a specific audiobook.
Get Chapter (GET /chapters/{id}) – Retrieves metadata for a single audiobook chapter.
Get Episode (GET /episodes/{id}) – Retrieves metadata for a single podcast episode.
Get Show (GET /shows/{id}) – Retrieves metadata for a single podcast show.
Get Show Episodes (GET /shows/{id}/episodes) – Retrieves episodes belonging to a specific podcast show.
Get Track (GET /tracks/{id}) – Retrieves metadata for a single track.
Search for Item (GET /search) – Searches across the Spotify catalog for albums, artists, playlists, tracks, shows, episodes, or audiobooks.
User
Get Current User's Profile (GET /me) – Retrieves profile information for the current authenticated user.
Personalisation
Get User's Top Items (GET /me/top/{type}) – Retrieves the user's top artists or tracks over a given time range.
Player
Add Item to Queue (POST /me/player/queue) – Adds an item to the playback queue.
Get Available Devices (GET /me/player/devices) – Retrieves devices available for playback.
Get Currently Playing Track (GET /me/player/currently-playing) – Retrieves the item currently being played.
Get Playback State (GET /me/player) – Retrieves information about the user's current playback state.
Get Recently Played Tracks (GET /me/player/recently-played) - Get tracks from the current user's recently played tracks.
Get User's Queue (GET /me/player/queue) – Retrieves the current playback queue.
Pause Playback (PUT /me/player/pause) – Pauses playback.
Seek to Position (PUT /me/player/seek) – Seeks to a specific position in the currently playing item.
Set Repeat Mode (PUT /me/player/repeat) – Sets repeat mode for playback.
Set Volume (PUT /me/player/volume) – Sets the playback volume.
Skip to Next (POST /me/player/next) – Skips to the next item in the queue.
Skip to Previous (POST /me/player/previous) – Skips to the previous item.
Start/Resume Playback (PUT /me/player/play) – Starts or resumes playback.
Toggle Shuffle (PUT /me/player/shuffle) – Toggles shuffle mode.
Transfer Playback (PUT /me/player) – Transfers playback to a new device.
Playlist
Get Playlist (GET /playlists/{id}) – Retrieves full details of a playlist.
Get Playlist Cover Image (GET /playlists/{id}/images) – Retrieves the cover image(s) for a playlist.
Upload Custom Playlist Cover Image (PUT /playlists/{id}/images) – Uploads a custom image for a playlist.
See Also
February 2026 Migration Guide — Step-by-step migration instructions
Web API Documentation



Playlist

Request
GET/playlists/{playlist_id}
playlist_idstring
Required
The Spotify ID of the playlist.

Example: 3cEYpjA9oz9GiPac4AsH4n
marketstring
An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.
If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
Note: If neither market or user country are provided, the content is considered unavailable for the client.
Users can view the country that is associated with their account in the account settings.

Example: market=ES
fieldsstring
Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. For example, to get just the playlist''s description and URI: fields=description,uri. A dot separator can be used to specify non-reoccurring fields, while parentheses can be used to specify reoccurring fields within objects. For example, to get just the added date and user ID of the adder: fields=tracks.items(added_at,added_by.id). Use multiple parentheses to drill down into nested objects, for example: fields=tracks.items(track(name,href,album(name,href))). Fields can be excluded by prefixing them with an exclamation mark, for example: fields=tracks.items(track(name,href,album(!name,href)))

Example: fields=items(added_by.id,track(name,href,album(name,href)))
additional_typesstring
A comma-separated list of item types that your client supports besides the default track type. Valid types are: track and episode.
Note: This parameter was introduced to allow existing clients to maintain their current behaviour and might be deprecated in the future.
In addition to providing this parameter, make sure that your client properly handles cases of new types in the future by checking against the type field of each object.

Response
200
401
403
429
A playlist

collaborativeboolean
true if the owner allows other users to modify the playlist.

descriptionstring
Nullable
The playlist description. Only returned for modified, verified playlists, otherwise null.


external_urlsobject
Known external URLs for this playlist.

spotifystring
The Spotify URL for the object.

hrefstring
A link to the Web API endpoint providing full details of the playlist.

idstring
The Spotify ID for the playlist.


imagesarray of ImageObject
Images for the playlist. The array may be empty or contain up to three images. The images are returned by size in descending order. See Working with Playlists. Note: If returned, the source URL for the image (url) is temporary and will expire in less than a day.

urlstring
Required
The source URL of the image.

Example: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
heightinteger
Required
Nullable
The image height in pixels.

Example: 300
widthinteger
Required
Nullable
The image width in pixels.

Example: 300
namestring
The name of the playlist.


ownerobject
The user who owns the playlist


external_urlsobject
Known public external URLs for this user.

hrefstring
A link to the Web API endpoint for this user.

idstring
The Spotify user ID for this user.

typestring
The object type.

Allowed values: "user"
uristring
The Spotify URI for this user.

display_namestring
Nullable
The name displayed on the user's profile. null if not available.

publicboolean
The playlist's public/private status (if it is added to the user's profile): true the playlist is public, false the playlist is private, null the playlist status is not relevant. For more about public/private status, see Working with Playlists

snapshot_idstring
The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version


itemsobject
The items of the playlist. Note: This field is only available for playlists owned by the current user or playlists the user is a collaborator of.

hrefstring
Required
A link to the Web API endpoint returning the full result of the request

Example: "https://api.spotify.com/v1/me/shows?offset=0&limit=20"
limitinteger
Required
The maximum number of items in the response (as set in the query or by default).

Example: 20
nextstring
Required
Nullable
URL to the next page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"
offsetinteger
Required
The offset of the items returned (as set in the query or by default)

Example: 0
previousstring
Required
Nullable
URL to the previous page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"
totalinteger
Required
The total number of items available to return.

Example: 4

itemsarray of PlaylistTrackObject
Required

tracksobject
Deprecated
Deprecated: Use items instead. The tracks of the playlist.

hrefstring
Required
A link to the Web API endpoint returning the full result of the request

Example: "https://api.spotify.com/v1/me/shows?offset=0&limit=20"
limitinteger
Required
The maximum number of items in the response (as set in the query or by default).

Example: 20
nextstring
Required
Nullable
URL to the next page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"
offsetinteger
Required
The offset of the items returned (as set in the query or by default)

Example: 0
previousstring
Required
Nullable
URL to the previous page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"
totalinteger
Required
The total number of items available to return.

Example: 4

itemsarray of PlaylistTrackObject
Required
typestring
The object type: "playlist"

uristring
The Spotify URI for the playlist.

Add Items to Playlist

OAuth 2.0
Add one or more items to a user's playlist.

Authorization scopes
playlist-modify-public
playlist-modify-private
Request
POST/playlists/{playlist_id}/items
playlist_idstring
Required
The Spotify ID of the playlist.

Example: 3cEYpjA9oz9GiPac4AsH4n
positioninteger
The position to insert the items, a zero-based index. For example, to insert the items in the first position: position=0; to insert the items in the third position: position=2. If omitted, the items will be appended to the playlist. Items are added in the order they are listed in the query string or request body.

Example: position=0
urisstring
A comma-separated list of Spotify URIs to add, can be track or episode URIs. For example:
uris=spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M, spotify:episode:512ojhOuo1ktJprKbVcKyQ
A maximum of 100 items can be added in one request.
Note: it is likely that passing a large number of item URIs as a query parameter will exceed the maximum length of the request URI. When adding a large number of items, it is recommended to pass them in the request body, see below.

Example: uris=spotify%3Atrack%3A4iV5W9uYEdYUVa79Axb7Rh,spotify%3Atrack%3A1301WleyT98MSxVHPZCA6M
Body application/json
supports free form additional properties
urisarray of strings
A JSON array of the Spotify URIs to add. For example: {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M", "spotify:episode:512ojhOuo1ktJprKbVcKyQ"]}
A maximum of 100 items can be added in one request. Note: if the uris parameter is present in the query string, any URIs listed here in the body will be ignored.

positioninteger
The position to insert the items, a zero-based index. For example, to insert the items in the first position: position=0 ; to insert the items in the third position: position=2. If omitted, the items will be appended to the playlist. Items are added in the order they appear in the uris array. For example: {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M"], "position": 3}

Response
201
401
403
429
A snapshot ID for the playlist

snapshot_idstring
Example: "abc"


Create Playlist

OAuth 2.0
Create a playlist for the current Spotify user. (The playlist will be empty until you add tracks.) Each user is generally limited to a maximum of 11000 playlists.

Authorization scopes
playlist-modify-public
playlist-modify-private
Request
POST/me/playlists
Body application/json
supports free form additional properties
namestring
Required
The name for the new playlist, for example "Your Coolest Playlist". This name does not need to be unique; a user may have several playlists with the same name.

publicboolean
Defaults to true. The playlist's public/private status (if it should be added to the user's profile or not): true the playlist will be public, false the playlist will be private. To be able to create private playlists, the user must have granted the playlist-modify-private scope. For more about public/private status, see Working with Playlists

collaborativeboolean
Defaults to false. If true the playlist will be collaborative. Note: to create a collaborative playlist you must also set public to false. To create collaborative playlists you must have granted playlist-modify-private and playlist-modify-public scopes.

descriptionstring
value for playlist description as displayed in Spotify Clients and in the Web API.

Response
201
401
403
429
A playlist

collaborativeboolean
true if the owner allows other users to modify the playlist.

descriptionstring
Nullable
The playlist description. Only returned for modified, verified playlists, otherwise null.


external_urlsobject
Known external URLs for this playlist.

spotifystring
The Spotify URL for the object.

hrefstring
A link to the Web API endpoint providing full details of the playlist.

idstring
The Spotify ID for the playlist.


imagesarray of ImageObject
Images for the playlist. The array may be empty or contain up to three images. The images are returned by size in descending order. See Working with Playlists. Note: If returned, the source URL for the image (url) is temporary and will expire in less than a day.

urlstring
Required
The source URL of the image.

Example: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
heightinteger
Required
Nullable
The image height in pixels.

Example: 300
widthinteger
Required
Nullable
The image width in pixels.

Example: 300
namestring
The name of the playlist.


ownerobject
The user who owns the playlist


external_urlsobject
Known public external URLs for this user.

hrefstring
A link to the Web API endpoint for this user.

idstring
The Spotify user ID for this user.

typestring
The object type.

Allowed values: "user"
uristring
The Spotify URI for this user.

display_namestring
Nullable
The name displayed on the user's profile. null if not available.

publicboolean
The playlist's public/private status (if it is added to the user's profile): true the playlist is public, false the playlist is private, null the playlist status is not relevant. For more about public/private status, see Working with Playlists

snapshot_idstring
The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version


itemsobject
The items of the playlist. Note: This field is only available for playlists owned by the current user or playlists the user is a collaborator of.

hrefstring
Required
A link to the Web API endpoint returning the full result of the request

Example: "https://api.spotify.com/v1/me/shows?offset=0&limit=20"
limitinteger
Required
The maximum number of items in the response (as set in the query or by default).

Example: 20
nextstring
Required
Nullable
URL to the next page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"
offsetinteger
Required
The offset of the items returned (as set in the query or by default)

Example: 0
previousstring
Required
Nullable
URL to the previous page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"
totalinteger
Required
The total number of items available to return.

Example: 4

itemsarray of PlaylistTrackObject
Required

tracksobject
Deprecated
Deprecated: Use items instead. The tracks of the playlist.

hrefstring
Required
A link to the Web API endpoint returning the full result of the request

Example: "https://api.spotify.com/v1/me/shows?offset=0&limit=20"
limitinteger
Required
The maximum number of items in the response (as set in the query or by default).

Example: 20
nextstring
Required
Nullable
URL to the next page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"
offsetinteger
Required
The offset of the items returned (as set in the query or by default)

Example: 0
previousstring
Required
Nullable
URL to the previous page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"
totalinteger
Required
The total number of items available to return.

Example: 4

itemsarray of PlaylistTrackObject
Required
typestring
The object type: "playlist"

uristring
The Spotify URI for the playlist.