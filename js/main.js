const Api = {
    getArtists: () => Api.get('artists'),
    getAlbums: () => Api.get('albums'),
    getTracks: () => Api.get('tracks'),
    getPlaylists: () => Api.get('playlists').then(playlists => {
        const commentPromises = playlists.map(playlist => {
            return Api.getCommentsByPlaylistId(playlist._id);
        });

        return Promise.all(commentPromises).then(playlistComments => {
            return playlists.map((playlist, index) => {
                playlist.comments = playlistComments[index];
                return playlist;
            });
        });
    }),
    get(type) {
        return fetch(`https://folksa.ga/api/${type}?key=flat_eric&limit=50`)
            .then(response => response.json())
            .catch(error => {
                console.log('error');
                return [];
            });
    },
    getCommentsByPlaylistId(id) {
        return fetch(`https://folksa.ga/api/playlists/${id}/comments?key=flat_eric&limit=50`)
            .then(response => response.json())
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
        
            artistImage.onerror = () => {
                artistImage.onerror = undefined;
                artistImage.src = 'images/103__user.svg';
            }
            
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

            albumImage.onerror = () => {
                albumImage.onerror = undefined;
                albumImage.src = 'images/140__music.svg';
            }

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
    displayPlaylistComments(commentField, comments) {
        const listAllComments = comments.map(comment => {
            const commentItem = document.querySelector('.comment-item-template').cloneNode(true);
            commentItem.classList.remove('comment-item-template');
            const username = commentItem.querySelector('.username');
            username.innerHTML = comment.username;
            const commentText = commentItem.querySelector('.comment-text');
            commentText.innerHTML = comment.body;

            console.log(comment);
            return commentItem;
        });

        commentField.innerHTML = '';
        listAllComments.forEach(comment => commentField.appendChild(comment));
    },
    displayPlaylists(playlists) {
        const listAllPlaylists = playlists.map(playlist => {
            const playlistItem = document.querySelector('.playlist-container-template').cloneNode(true);
            playlistItem.classList.remove('playlist-container-template');
            const playlistCover = playlistItem.querySelector('.playlist-cover');
            playlistCover.src = playlist.coverImage;
            playlistCover.onerror = () => {
                playlistCover.onerror = undefined;
                playlistCover.src = 'images/144__headphone.svg';
            }
           
            playlistCover.alt = `Coverimage for the playlist ${playlist.title}`;
            const playlistTitle = playlistItem.querySelector('.playlist-title');
            playlistTitle.innerHTML = playlist.title;
            const playlistContainer = playlistItem.querySelector('.playlist');

            const commentField = playlistItem.querySelector('.comment-field');

            View.displayPlaylistComments(commentField, playlist.comments);

            playlist.tracks.map(track => {
                const playlistTrack = playlistContainer.querySelector('.playlist-item-template').cloneNode(true);
                playlistTrack.classList.remove('playlist-item-template');
                const trackTitle = playlistTrack.querySelector('.track-title');
                trackTitle.innerHTML = track.title;

                const playlistArtist = playlistTrack.querySelector('.artist-name');
                playlistArtist.innerHTML = track.artists.map(artist => artist.name).join(', ');

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
    toggleMenu(){
        const nav = document.getElementById('nav');

        if (nav.classList.contains('invisible')){
            nav.classList.remove('invisible');
        }
        else {
            nav.classList.add('invisible');
        }
    }
}

const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
    View.toggleMenu();
});

const navLinks = document.querySelectorAll('#nav [data-view]');
navLinks.forEach(link =>
    link.addEventListener('click', () => View.switchView(link.getAttribute('data-view'))));

Api.getArtists().then(artists => View.displayArtists(artists));
Api.getAlbums().then(albums => View.displayAlbums(albums));
Api.getTracks().then(tracks => View.displayTracks(tracks));
Api.getPlaylists().then(playlists => View.displayPlaylists(playlists));

