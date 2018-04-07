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
    deletePlaylistComment(id){
        return Api.delete('comments', id)
    },
    deletePlaylist: (id) => Api.delete('playlist', id),
    deleteArtist: (id) => Api.delete('artists', id),
    deleteAlbum: (id) => Api.delete('albums', id),
    delete(type, id){
        return fetch(`https://folksa.ga/api/${type}/${id}?key=flat_eric`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            if (!resp.ok) {
                console.log('Api got angry :/', resp.status);
            }
        });
    },
    getCommentsByPlaylistId(id) {
        return fetch(`https://folksa.ga/api/playlists/${id}/comments?key=flat_eric&limit=50`)
            .then(response => response.json())
            .catch(error => {
                console.log('error', error);
                return [];
            });
    },
    postPlaylistComment(id, body, username) {
        const comment = {
            playlist: id,
            body: body,
            username: username
        };

        return fetch(`https://folksa.ga/api/playlists/${id}/comments?key=flat_eric`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
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

            const deleteArtistButton = artistContainer.querySelector('.delete-artist');
            deleteArtistButton.addEventListener('click', () => {
                Api.deleteArtist(artist._id)
                    .then(() => artistContainer.parentNode.removeChild(artistContainer));
            });

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

            const deleteAlbumButton = albumContainer.querySelector('.delete-album');
            deleteAlbumButton.addEventListener('click', () => {
                Api.deleteAlbum(album._id)
                    .then(() => albumContainer.parentNode.removeChild(albumContainer));
            });

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
    displayPlaylistComments(commentSection, comments) {
        const listAllComments = comments.map(comment => {
            const commentItem = document.querySelector('.comment-item-template').cloneNode(true);
            commentItem.classList.remove('comment-item-template');
            const username = commentItem.querySelector('.username');
            username.innerHTML = comment.username;
            const commentText = commentItem.querySelector('.comment-text');
            commentText.innerHTML = comment.body;

            const deleteCommentButton = commentItem.querySelector('.delete-comment');

            deleteCommentButton.addEventListener('click', () => {
                Api.deletePlaylistComment(comment._id)
                    .then(() => Api.getCommentsByPlaylistId(comment.playlist))
                    .then(comments => View.displayPlaylistComments(commentSection, comments));
            });

            return commentItem;
        });

        const commentField = commentSection.querySelector('.comment-field');
        const commentFieldHeading = commentSection.querySelector('.comment-field-heading');
        commentFieldHeading.innerHTML = `Comments (${comments.length})`;

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

            const ratings = playlist.ratings;
            const ratingsTotal = ratings.reduce((sum, ratings) => sum + ratings, 0);

            const playlistRating = playlistItem.querySelector('.playlist-rating');
            playlistRating.innerHTML = `(${ratingsTotal} votes)`;

            const playlistCreator = playlistItem.querySelector('.playlist-creator');
            playlistCreator.innerHTML = `created by ${playlist.createdBy}`

            const deletePlaylistButton = playlistItem.querySelector('.delete-playlist');
            deletePlaylistButton.addEventListener('click', () => {
                Api.deletePlaylist(playlist._id)
                    .then(() => playlistItem.parentNode.removeChild(playlistItem));
            });

            const playlistContainer = playlistItem.querySelector('.playlist');

            const commentSection = playlistItem.querySelector('.comment-section');
            View.displayPlaylistComments(commentSection, playlist.comments);

            const commentForm = playlistItem.querySelector('.comment-form');

            commentForm.addEventListener('submit', event => {
                event.preventDefault();
                const username = commentForm.elements.username;
                const body = commentForm.elements.body;
                Api.postPlaylistComment(playlist._id, body.value, username.value)
                    .then(() => Api.getCommentsByPlaylistId(playlist._id))
                    .then(comments => View.displayPlaylistComments(commentSection, comments));
                username.value = '';
                body.value = '';
            });

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
    toggleMenu() {
        const nav = document.getElementById('nav');

        if (nav.classList.contains('invisible')) {
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