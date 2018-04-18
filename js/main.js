
const artistList = document.getElementById('artist-list');
View.showSpinner(artistList);
Api.getArtists().then(artists => View.displayArtists(artistList, artists,
    (artistId, artistContainer) => {
        Api.deleteArtist(artistId)
            .then(() => artistContainer.parentNode.removeChild(artistContainer));
    }));

const albumList = document.getElementById('album-list');
View.showSpinner(albumList);
Api.getAlbums().then(albums => View.displayAlbums(albumList, albums,
    (albumId, vote) => Api.voteOnAlbum(albumId, vote),
    (albumId, albumContainer) => {
        Api.deleteAlbum(albumId)
            .then(() => albumContainer.parentNode.removeChild(albumContainer));
    },
));

const trackList = document.getElementById('track-list');
View.showSpinner(trackList);
Api.getTracks().then(tracks => View.displayTracks(trackList, tracks,
    (trackId, vote) => Api.voteOnTrack(trackId, vote),
    (trackId, trackItem) => {
        Api.deleteTrack(trackId)
            .then(() => trackItem.parentNode.removeChild(trackItem));
    },
));

const playlistList = document.getElementById('playlists-container');
View.showSpinner(playlistList);
Api.getPlaylists().then(playlists => View.displayPlaylists(playlistList, playlists,
    (comment, commentSection) =>
        Api.deletePlaylistComment(comment._id)
            .then(() => Api.getCommentsByPlaylistId(comment.playlist))
            .then(comments => View.displayPlaylistComments(commentSection, comments)),
    (playlist, vote) =>
        Api.voteOnPlaylist(playlist._id, vote),
    (playlist, playlistItem) =>
        Api.deletePlaylist(playlist._id)
            .then(() => playlistItem.parentNode.removeChild(playlistItem)),
    (playlist, body, username, commentSection, onCommentDelete) =>
        Api.postPlaylistComment(playlist._id, body.value, username.value)
            .then(() => Api.getCommentsByPlaylistId(playlist._id))
            .then(comments => View.displayPlaylistComments(commentSection, comments, onCommentDelete)),
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
    Forms.init(result[0], result[1], result[2]);
});

View.init();
Nav.init();