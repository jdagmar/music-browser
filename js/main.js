const Api = {
    getArtists: () => Api.get('artists'),
    getAlbums: () => Api.get('albums'),
    getTracks: () => Api.get('tracks'),
    getPlaylists: () => Api.get('playlists'),
    get(type) {
        return fetch(`https://folksa.ga/api/${type}?key=flat_eric`)
            .then(response => response.json())
            .catch(error => {
                console.log('error');
                return [];
            });
    },
    getComments(id) {
        id = '5aae312ee3534b03981f6521';

        fetch(`https://folksa.ga/api/playlists/${id}/comments?key=flat_eric`)
            .then(response => response.json())
            .then(comments => {
                View.displayComments(comments);
            })
            .catch(error => {
                console.log('error', error);
                return [];
            });
    }
}

const View = {
    displayArtists(artists) {
        const listAllArtist = artists.map(artist => {
            const artistContainer = document.querySelector('.artist-container-template').cloneNode(true);
            artistContainer.classList.remove('artist-container-template');

            const artistImage = artistContainer.querySelector('.artist-image');
            artistImage.src = artist.image || artist.coverImage;
            artistImage.alt = artist.name;

            const artistImageCaption = artistContainer.querySelector('.artist-image-caption');
            artistImageCaption.innerHTML = artist.name;

            return artistContainer;
        });
        const artistList = document.getElementById('artist-list');
        artistList.innerHTML = '';
        listAllArtist.forEach(artistContainer => artistList.appendChild(artistContainer));
    },
    displayAlbums(albums) {
        const listAllAlbums = albums.map(album => {
            const albumContainer = document.querySelector('.album-container-template').cloneNode(true);
            albumContainer.classList.remove('album-container-template');

            const albumImage = albumContainer.querySelector('.album-image');
            albumImage.src = album.image || album.coverImage;
            albumImage.alt = album.title;

            const albumImageCaption = albumContainer.querySelector('.album-image-caption');
            albumImageCaption.innerHTML = album.title;

            return albumContainer;
        });

        const albumList = document.getElementById('album-list');
        albumList.innerHTML = '';
        listAllAlbums.forEach(albumContainer => albumList.appendChild(albumContainer));
    },
    displayTracks(tracks) {
        const listAllTracks = tracks.map(track => {
            const trackItem = document.querySelector('.track-item-template').cloneNode(true);
            trackItem.classList.remove('track-item-template');

            const trackTitle = trackItem.querySelector('.track-title');
            const trackArtist = trackItem.querySelector('.track-artist');

            trackTitle.innerHTML = track.title;
            trackArtist.innerHTML = track.artists.map(artist => artist.name).join(', ');

            return trackItem;
        });

        const trackList = document.getElementById('track-list');
        trackList.innerHTML = '';
        listAllTracks.forEach(trackItem => trackList.appendChild(trackItem));
    },
    displayPlaylists(playlists) {
        const listAllPlaylists = playlists.map(playlist => {
            const playlistItem = document.querySelector('.playlist-container-template').cloneNode(true);
            playlistItem.classList.remove('playlist-container-template');
            const playlistCover = playlistItem.querySelector('.playlist-cover');
            playlistCover.src = playlist.coverImage;
            playlistCover.alt = `Coverimage for the playlist ${playlist.title}`;
            const playlistTitle = playlistItem.querySelector('.playlist-title');
            playlistTitle.innerHTML = playlist.title;
            const playlistContainer = playlistItem.querySelector('.playlist');

            playlist.tracks.map(track => {
                const playlistTrack = playlistItem.querySelector('.playlist-item-template').cloneNode(true);
                playlistTrack.classList.remove('playlist-item-template');
                const trackTitle = playlistItem.querySelector('.track-title');
                trackTitle.innerHTML = track.title;

                track.artists.map(artist => {
                    const playlistArtist = playlistItem.querySelector('.artist-name');
                    playlistArtist.innerHTML = artist.name;
                    return playlistArtist;
                });

                return playlistTrack;

            }).forEach(li => playlistContainer.appendChild(li));
            
            return playlistItem;
        });

        const playlistList = document.getElementById('playlists-container');
        playlistList.innerHTML = '';
        listAllPlaylists.forEach(playlistItem => playlistList.appendChild(playlistItem));
    },
    switchView(currentView) {
        const views = [
            'main-view',
            'all-artists',
            'all-albums',
            'all-tracks',
            'all-playlists'
        ];

        views.filter(view => view !== currentView)
            .forEach(view =>
                document.getElementById(view).classList.add('hidden'));

        document.getElementById(currentView).classList.remove('hidden');
    },
    displayComments(comments) {
        const listAllComments = comments.map(comments => {
            const commentItem = document.querySelector('.comment-item-template').cloneNode(true);
            commentItem.classList.remove('comment-item-template');
            const username = commentItem.querySelector('.username');
            username.innerHTML = comments.username;
            const commentText = commentItem.querySelector('.comment-text');
            commentText.innerHTML = comments.body;

            return commentItem;
        });

        const commentField = document.getElementById('comment-field');
        commentField.innerHTML = '';
        listAllComments.forEach(comment => commentField.appendChild(comment));
    }
}

const navLinks = document.querySelectorAll('#nav [data-view]');
navLinks.forEach(link =>
    link.addEventListener('click', () => View.switchView(link.getAttribute('data-view'))));

Api.getArtists().then(artists => View.displayArtists(artists));
Api.getAlbums().then(albums => View.displayAlbums(albums));
Api.getTracks().then(tracks => View.displayTracks(tracks));
Api.getPlaylists().then(playlists => View.displayPlaylists(playlists));

Api.getComments().then(comments => View.displayComments(comments));