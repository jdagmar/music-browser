const onArtistDelete = (artistId, artistContainer) => {
    Api.deleteArtist(artistId)
        .then(() => artistContainer.parentNode.removeChild(artistContainer));
};

const onAlbumDelete = (albumId, albumContainer) => {
    Api.deleteAlbum(albumId)
        .then(() => albumContainer.parentNode.removeChild(albumContainer));
}

const onTrackDelete = (trackId, trackItem) => {
    Api.deleteTrack(trackId)
        .then(() => trackItem.parentNode.removeChild(trackItem));
}

const onPlaylistDelete = (playlist, playlistItem) =>
    Api.deletePlaylist(playlist._id)
        .then(() => playlistItem.parentNode.removeChild(playlistItem));

const onCommentDelete = (comment, commentItem) =>
    Api.deletePlaylistComment(comment._id)
        .then(() => commentItem.parentNode.removeChild(commentItem));

const onPostPlaylistComment = (playlist, body, username, commentSection, onCommentDelete) =>
    Api.postPlaylistComment(playlist._id, body.value, username.value)
        .then(() => Api.getCommentsByPlaylistId(playlist._id))
        .then(comments => View.displayPlaylistComments(commentSection, comments, onCommentDelete))

const onAlbumVote = (albumId, vote) => Api.voteOnAlbum(albumId, vote);
const onTrackVote = (trackId, vote) => Api.voteOnTrack(trackId, vote);
const onPlaylistVote = (playlist, vote) => Api.voteOnPlaylist(playlist._id, vote);

const artistList = document.getElementById('artist-list');
View.showSpinner(artistList);
Api.getArtists().then(artists => View.displayArtists(artistList, artists, onArtistDelete));

const albumList = document.getElementById('album-list');
View.showSpinner(albumList);
Api.getAlbums().then(albums => View.displayAlbums(albumList, albums,
    onAlbumVote
    , onAlbumDelete));

const trackList = document.getElementById('track-list');
View.showSpinner(trackList);
Api.getTracks().then(tracks => View.displayTracks(trackList, tracks,
    onTrackVote,
    onTrackDelete
));

const playlistList = document.getElementById('playlists-container');
View.showSpinner(playlistList);
Api.getPlaylists().then(playlists => View.displayPlaylists(playlistList, playlists,
    onCommentDelete,
    onPlaylistVote,
    onPlaylistDelete,
    onPostPlaylistComment,
));

const topTenPLaylistsContainer = document.getElementById('top-ten-playlists-container');
View.showSpinner(topTenPLaylistsContainer);
Api.getPlaylists().then(playlists => View.displayTopTenPlaylists(topTenPLaylistsContainer, playlists));

const topTenTracksContainer = document.getElementById('top-ten-tracks-container');
View.showSpinner(topTenTracksContainer);
Api.getTracks().then(tracks => View.displayTopTenTracks(topTenTracksContainer, tracks));

const topTenAlbumsContainer = document.getElementById('top-ten-albums-container');
View.showSpinner(topTenAlbumsContainer);
Api.getAlbums().then(albums => View.displayTopTenAlbums(topTenAlbumsContainer, albums));

Promise.all([Api.getAlbums(), Api.getArtists(), Api.getTracks()]).then(result => {
    Forms.init(result[0], result[1], result[2],
        searchWord => {
            /* gets all containers in searchView and then adds a loadingspinner to
            containers with searchresults */
            const containers = View.getSearchResultsContainers();
            Object.keys(containers).map(key => View.showSpinner(containers[key]));

            Api.searchAll(searchWord)
                .then(result => View.displaySearchResults(result))
        },   
        artistForm =>
            Api.addArtist(artistForm.name, artistForm.born, artistForm.genres, artistForm.gender, artistForm.countryBorn,
                artistForm.spotifyURL, artistForm.artistImage)
                .then(() => Api.getArtists().then(artists => View.displayArtists(artistList, artists, onArtistDelete))),
        albumForm =>
            Api.addAlbum(albumForm.title, albumForm.artists, albumForm.releaseDate, albumForm.genres, albumForm.spotifyURL,
                albumForm.coverImage)
                .then(() => Api.getAlbums().then(albums => View.displayAlbums(albumList, albums, onAlbumDelete))),
        trackForm => Api.addTrack(trackForm.title, trackForm.artists, trackForm.album, trackForm.genres, trackForm.coverImage,
            trackForm.spotifyURL, trackForm.youtubeURL)
            .then(() => Api.getTracks().then(tracks => View.displayTracks(trackList, tracks, onTrackVote, onTrackDelete))),
        playlistForm => Api.addPlaylist(playlistForm.title, playlistForm.tracks, playlistForm.genres, playlistForm.coverImage,
            playlistForm.createdBy)
            .then(() => Api.getPlaylists().then(playlists => View.displayPlaylists(playlistList, playlists, onCommentDelete,
                onPlaylistVote, onPlaylistDelete, onPostPlaylistComment)))
    )
});

View.init();
Nav.init();