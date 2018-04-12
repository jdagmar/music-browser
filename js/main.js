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
        return Api.responseToJson(fetch(`https://folksa.ga/api/${type}?key=flat_eric&limit=200&populateArtists=true`))
            .catch(() => {
                return [];
            });
    },
    deletePlaylistComment(id) {
        return Api.delete('comments', id)
    },
    deletePlaylist: (id) => Api.delete('playlists', id),
    deleteArtist: (id) => Api.delete('artists', id),
    deleteAlbum: (id) => Api.delete('albums', id),
    deleteTrack: (id) => Api.delete('tracks', id),
    delete(type, id) {
        return Api.responseToJson(fetch(`https://folksa.ga/api/${type}/${id}?key=flat_eric`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })).catch(() => {
            return {};
        });
    },
    getCommentsByPlaylistId(id) {
        return Api.responseToJson(fetch(`https://folksa.ga/api/playlists/${id}/comments?key=flat_eric&limit=50`))
            .catch(() => {
                return {};
            });
    },
    postPlaylistComment(id, body, username) {
        const comment = {
            playlist: id,
            body: body,
            username: username
        };

        return Api.responseToJson(fetch(`https://folksa.ga/api/playlists/${id}/comments?key=flat_eric`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        })).catch(() => {
            return {};
        });
    },
    addArtist(name, born, genres, gender, countryBorn, spotifyURL, coverImage) {
        const artist = {
            name: name,
            born: born,
            genres: genres,
            gender: gender,
            countryBorn: countryBorn,
            spotifyURL: spotifyURL,
            coverImage: coverImage
        };

        return Api.responseToJson(fetch(`https://folksa.ga/api/artists?key=flat_eric`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artist)
        }))
        .then(Api.successHandler)
        .catch(() => {
            return {};
        });
    },
    addAlbum(title, artists, releaseDate, genres, spotifyURL, coverImage) {
        const album = {
            title: title,
            artists: artists,
            releaseDate: releaseDate,
            genres: genres,
            spotifyURL: spotifyURL,
            coverImage: coverImage
        };

        return Api.responseToJson(fetch(`https://folksa.ga/api/albums?key=flat_eric`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(album)
        }))
        .then(Api.successHandler)
        .catch(() => {
            return {};
        });
    },
    addTrack(title, artists, album, genres, coverImage, spotifyURL, youtubeURL, soundcloudURL) {
        const track = {
            title: title,
            artists: artists,
            album: album,
            genres: genres
        };

        return Api.responseToJson(fetch(`https://folksa.ga/api/tracks?key=flat_eric`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(track)
        }))
        .then(Api.successHandler)
        .catch(() => {
            return {};
        });
    },
    addPlaylist(title, tracks, genres, coverImage, createdBy) {
        const playlist = {
            title: title,
            genres: genres,
            createdBy: createdBy,
            tracks: tracks,
            coverImage: coverImage,
        }

        return Api.responseToJson(fetch('https://folksa.ga/api/playlists?key=flat_eric', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playlist)
        }))
        .then(Api.successHandler)
        .catch(() => {
            return {};
        });
    },
    voteOnAlbum: (id, vote) => Api.vote('albums', id, vote),
    voteOnTrack: (id, vote) => Api.vote('tracks', id, vote),
    voteOnPlaylist: (id, vote) => Api.vote('playlists', id, vote),
    vote(type, id, vote) {
        return Api.responseToJson(fetch(`https://folksa.ga/api/${type}/${id}/vote?key=flat_eric`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating: vote })
        }))
        .then(Api.successHandler)
        .catch(() => {
            return {};
        });
    },
    responseToJson(responsePromise) {
        return responsePromise
            .then(response => {
                if (response.ok) {
                    return response;
                }
        
                return Promise.reject(response);
            })
            .then(response => response.json())
            .catch(Api.errorHandler)
    },
    errorHandler(response) {
        const failedLoadingMsg = document.getElementById('failed-loading-msg');
        failedLoadingMsg.classList.remove('hidden');

        const closeFailMsgButton = document.getElementById('close-fail-msg');
        closeFailMsgButton.addEventListener('click', () => {
            failedLoadingMsg.classList.add('hidden');
        });

        return Promise.reject(respone);
    },
    successHandler(){
        const successAddMsg = document.getElementById('add-success-msg');
        successAddMsg.classList.remove('hidden');

        const closeSuccessMsgButton = document.getElementById('close-success-msg');
        closeSuccessMsgButton.addEventListener('click', () => {
            successAddMsg.classList.add('hidden');
        });
    }
}

const View = {
    displayArtists(artistList, artists) {
        const listAllArtist = artists.map(artist => {
            const artistContainer = document.querySelector('.artist-container-template').cloneNode(true);
            artistContainer.classList.remove('artist-container-template');

            const artistImage = artistContainer.querySelector('.artist-image');
            artistImage.src = artist.image || artist.coverImage;
            artistImage.alt = artist.name;

            artistImage.onerror = () => {
                artistImage.onerror = undefined;
                artistImage.src = 'images/103__user.svg';
                artistImage.alt = 'no image was uploaded, fallback image of user icon is in use';
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
        artistList.innerHTML = '';
        listAllArtist.forEach(artistContainer => artistList.appendChild(artistContainer));
    },
    displayAlbums(albumList, albums) {
        const listAllAlbums = albums.map(album => {
            const albumContainer = document.querySelector('.album-container-template').cloneNode(true);
            albumContainer.classList.remove('album-container-template');

            const albumImage = albumContainer.querySelector('.album-image');
            albumImage.src = album.image || album.coverImage;

            albumImage.onerror = () => {
                albumImage.onerror = undefined;
                albumImage.src = 'images/140__music.svg';
                albumImage.alt = 'no image was uploaded, fallback image of note icon is in use';
            }

            albumImage.alt = album.title;

            const ratings = album.ratings;
            const ratingsTotal = ratings.reduce((sum, ratings) => sum + ratings, 0);

            const albumImageCaption = albumContainer.querySelector('.album-image-caption');
            albumImageCaption.innerHTML = `${album.title} (${ratingsTotal} votes)`;

            const deleteAlbumButton = albumContainer.querySelector('.delete-album');
            deleteAlbumButton.addEventListener('click', () => {
                Api.deleteAlbum(album._id)
                    .then(() => albumContainer.parentNode.removeChild(albumContainer));
            });

            const albumVoteForm = albumContainer.querySelector('.album-vote-form');
            const albumRatingSelect = new Choices(albumContainer.querySelector('.album-vote'), {
                position: 'bottom',
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false
            });

            albumVoteForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const vote = albumVoteForm.elements['album-rating'];
                Api.voteOnAlbum(album._id, vote.value);
            });

            return albumContainer;
        });

        albumList.innerHTML = '';
        listAllAlbums.forEach(albumContainer => albumList.appendChild(albumContainer));
    },
    displayTracks(trackList, tracks) {
        const listAllTracks = tracks.map(track => {
            const trackItem = document.querySelector('.track-item-template').cloneNode(true);
            trackItem.classList.remove('track-item-template');

            const trackTitle = trackItem.querySelector('.track-title');
            const trackArtist = trackItem.querySelector('.track-artist');

            const ratings = track.ratings;
            const ratingsTotal = ratings.reduce((sum, ratings) => sum + ratings, 0);

            trackTitle.innerHTML = `${track.title} (${ratingsTotal} votes)`;
            trackArtist.innerHTML = track.artists.map(artist => artist.name).join(', ');

            const deleteTrackButton = trackItem.querySelector('.delete-track');
            deleteTrackButton.addEventListener('click', () => {
                Api.deleteTrack(track._id)
                    .then(() => trackItem.parentNode.removeChild(trackItem));
            });

            const trackVoteForm = trackItem.querySelector('.track-vote-form');
            const trackRatingSelect = new Choices(trackItem.querySelector('.track-rating'), {
                position: 'bottom',
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false
            });

            trackVoteForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const vote = trackVoteForm.elements['track-rating'];
                Api.voteOnTrack(track._id, vote.value);
            });

            return trackItem;
        });

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
    displayPlaylists(playlistList, playlists) {
        const listAllPlaylists = playlists.map(playlist => {
            const playlistItem = document.querySelector('.playlist-container-template').cloneNode(true);
            playlistItem.classList.remove('playlist-container-template');
            playlistItem.id = `playlist-${playlist._id}`;

            const playlistCover = playlistItem.querySelector('.playlist-cover');
            playlistCover.src = playlist.coverImage;

            playlistCover.onerror = () => {
                playlistCover.onerror = undefined;
                playlistCover.src = 'images/144__headphone.svg';
                playlistCover.alt = 'no image was uploaded, fallback image of headphones icon is in use';
            }

            playlistCover.alt = `Coverimage for the playlist ${playlist.title}`;

            const playlistTitle = playlistItem.querySelector('.playlist-title');
            playlistTitle.innerHTML = playlist.title;

            const ratings = playlist.ratings;
            const ratingsTotal = ratings.reduce((sum, ratings) => sum + ratings, 0);
            const averageRating = ratings.length > 0 ? Math.floor(ratingsTotal / ratings.length) : 'no votes yet';

            const playlistRating = playlistItem.querySelector('.playlist-rating');
            playlistRating.innerHTML = `(${averageRating})`;

            const playlistVoteForm = playlistItem.querySelector('.playlist-vote-form');
            const playlistRatingSelect = new Choices(playlistItem.querySelector('.playlist-vote'), {
                position: 'bottom',
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false
            });

            playlistVoteForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const vote = playlistVoteForm.elements['playlist-rating'];
                Api.voteOnPlaylist(playlist._id, vote.value);
            });

            const playlistCreator = playlistItem.querySelector('.playlist-creator');
            playlistCreator.innerHTML = `created by ${playlist.createdBy}`

            const genres = playlist.genres.map(genres => genres);

            const playlistGenres = playlistItem.querySelector('.playlist-genres');
            playlistGenres.innerHTML = genres;

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
    },
    displayTopTenPlaylists(topTenPLaylistsContainer, playlists) {
        playlists.sort(compareAverageRating);

        const topTenPLaylists = playlists.filter(playlist => getAverageRating(playlist) > 0)
            .slice(0, 10)
            .map(playlist => {
                const topTenPLaylistsItem = document.querySelector('.top-ten-playlist-item-template').cloneNode(true);
                topTenPLaylistsItem.classList.remove('top-ten-playlist-item-template');

                const topTenPLaylistsItemTitle = topTenPLaylistsItem.querySelector('.top-ten-playlist-title');
                topTenPLaylistsItemTitle.innerHTML = playlist.title;

                topTenPLaylistsItemTitle.addEventListener('click', () => {
                    this.switchView('all-playlists');

                    setTimeout(() => {
                        const playlistLocation = document.getElementById(`playlist-${playlist._id}`);
                        playlistLocation.scrollIntoView({ behavior: 'smooth' });
                    });
                });

                const topTenPLaylistsItemAuthor = topTenPLaylistsItem.querySelector('.top-ten-playlist-author');
                topTenPLaylistsItemAuthor.innerHTML = playlist.createdBy;

                const topTenPLaylistsItemRating = topTenPLaylistsItem.querySelector('.top-ten-playlist-rating');
                topTenPLaylistsItemRating.innerHTML = getAverageRating(playlist);

                return topTenPLaylistsItem;
            });

        topTenPLaylistsContainer.innerHTML = '';
        topTenPLaylists.forEach(topTenPLaylistsItem => topTenPLaylistsContainer.appendChild(topTenPLaylistsItem));
    },
    displayTopTenTracks(topTenTracksContainer, tracks){
        tracks.sort(compareAverageRating);

        const topTenTracks = tracks.filter(tracks => getAverageRating(tracks) > 0)
        .slice(0, 10)
        .map(tracks => {
            const topTenTracksItem = document.querySelector('.top-ten-tracks-item-template').cloneNode(true);
            topTenTracksItem.classList.remove('top-ten-tracks-item-template');

            const topTenTracksItemTitle = topTenTracksItem.querySelector('.top-ten-track-title');
            topTenTracksItemTitle.innerHTML = tracks.title;

            const topTenTracksItemArtist = topTenTracksItem.querySelector('.top-ten-track-artist');
            topTenTracksItemArtist.innerHTML = tracks.artists.map(artist => artist.name).join(', ');

            const topTenTracksItemRating = topTenTracksItem.querySelector('.top-ten-track-rating');
            topTenTracksItemRating.innerHTML = getAverageRating(tracks);

            return topTenTracksItem;
        });

        topTenTracksContainer.innerHTML = '';
        topTenTracks.forEach(topTenTracksItem => topTenTracksContainer.appendChild(topTenTracksItem));
    },
    displayTopTenAlbums(topTenAlbumsContainer, albums){
        albums.sort(compareAverageRating);

        const topTenAlbums = albums.filter(albums => getAverageRating(albums) > 0)
        .slice(0, 10)
        .map(albums => {
            const topTenAlbumsItem = document.querySelector('.top-ten-albums-item-template').cloneNode(true);
            topTenAlbumsItem.classList.remove('top-ten-albums-item-template');

            const topTenAlbumsItemTitle = topTenAlbumsItem.querySelector('.top-ten-album-title');
            topTenAlbumsItemTitle.innerHTML = albums.title;

            console.log(albums);

            const topTenAlbumsItemArtist = topTenAlbumsItem.querySelector('.top-ten-album-artist');
            topTenAlbumsItemArtist.innerHTML = albums.artists.map(artist => artist.name).join(', ');

            const topTenAlbumsItemRating = topTenAlbumsItem.querySelector('.top-ten-album-rating');
            topTenAlbumsItemRating.innerHTML = getAverageRating(albums);

            return topTenAlbumsItem;
        });

        topTenAlbumsContainer.innerHTML = '';
        topTenAlbums.forEach(topTenAlbumsItem => topTenAlbumsContainer.appendChild(topTenAlbumsItem));
    },
    showSpinner(container) {
        const spinner = document.createElement('img');
        spinner.src = 'images/bars.svg';
        spinner.alt = 'loading resources';
        spinner.classList.add('spinner');

        container.appendChild(spinner);
    }
}

const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
    View.toggleMenu();
});

const getAverageRating = (resource) => {
    const ratings = resource.ratings;
    const ratingsTotal = ratings.reduce((sum, ratings) => sum + ratings, 0);
    const averageRating = ratings.length > 0 ? Math.floor(ratingsTotal / ratings.length) : 0;

    return averageRating;
}

const compareAverageRating = (a, b) => {
    const aRating = getAverageRating(a);
    const bRating = getAverageRating(b);

    return bRating - aRating;
}

const addArtistForm = document.getElementById('add-artist-form');
const genderChoices = new Choices('#artist-gender', {
    searchEnabled: false
});

addArtistForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = addArtistForm.elements['artist-name'];
    const born = addArtistForm.elements['artist-birthdate'];
    const genres = addArtistForm.elements['artist-genres'];
    const gender = addArtistForm.elements['artist-gender'];
    const countryBorn = addArtistForm.elements['artist-country'];
    const spotifyURL = addArtistForm.elements['artist-spotify'];
    const artistImage = addArtistForm.elements['artist-image'];

    Api.addArtist(name.value, born.value, genres.value, gender.value, countryBorn.value,
        spotifyURL.value, artistImage.value);

    name.value = '';
    born.value = '';
    genres.value = '';
    gender.value = '';
    countryBorn.value = '';
    spotifyURL.value = '';
    artistImage.value = '';
});

const addAlbumForm = document.getElementById('add-album-form');
const artistSelect = new Choices('#artist-select', {
    position: 'bottom'
});

addAlbumForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = addAlbumForm.elements['album-title'];
    const artists = artistSelect.getValue(true).join(',');
    const releaseDate = addAlbumForm.elements['album-release'];
    const genres = addAlbumForm.elements['album-genres'];
    const spotifyURL = addAlbumForm.elements['album-spotify'];
    const coverImage = addAlbumForm.elements['album-cover'];

    Api.addAlbum(title.value, artists, releaseDate.value, genres.value, spotifyURL.value,
        coverImage.value);

    title.value = '';
    artistSelect.removeActiveItems().clearInput();
    releaseDate.value = '';
    genres.value = '';
    spotifyURL.value = '';
    coverImage.value = '';
});

const addTrackForm = document.getElementById('add-track-form');
const albumSelect = new Choices('#album-select', {
    position: 'bottom'
});

albumSelect.passedElement.addEventListener('choice', (event) => {
    const albumId = event.detail.choice.value;

    const filteredArtists = trackArtistSelect.store.getChoices().map(choice => {
        return ({
            value: choice.value,
            label: choice.label,
            customProperties: choice.customProperties,
            disabled: choice.customProperties.albums.indexOf(albumId) < 0
        })
    });

    trackArtistSelect.setChoices(filteredArtists, 'value', 'label', true);
    trackArtistSelect.enable();
});

const trackArtistSelect = new Choices('#track-artist-select', {
    position: 'bottom'
});

trackArtistSelect.disable();

addTrackForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = addTrackForm.elements['track-title'];
    const artists = trackArtistSelect.getValue(true).join(',');
    const album = albumSelect.getValue(true);
    const genres = addTrackForm.elements['track-genres'];
    const coverImage = addTrackForm.elements['track-cover-image'];
    const spotifyURL = addTrackForm.elements['track-spotify'];
    const youtubeURL = addTrackForm.elements['track-youtube'];
    const soundcloudURL = addTrackForm.elements['track-soundcloud'];

    Api.addTrack(title.value, artists, album, genres.value, coverImage.value,
        spotifyURL.value, youtubeURL.value);

    title.value = '';
    trackArtistSelect.removeActiveItems().clearInput();
    albumSelect.removeActiveItems().clearInput();
    genres.value = '';
    coverImage.value = '';
    spotifyURL.value = '';
    youtubeURL.value = '';
    soundcloudURL.value = '';
});

const addPlaylistForm = document.getElementById('add-playlist-form');
const playlistTrackSelect = new Choices('#playlist-track-select', {
    position: 'bottom'
});

addPlaylistForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = addPlaylistForm.elements['playlist-title'];
    const tracks = playlistTrackSelect.getValue(true).join(',');
    const genres = addPlaylistForm.elements['playlist-genres'];
    const coverImage = addPlaylistForm.elements['playlist-cover-image'];
    const createdBy = addPlaylistForm.elements['playlist-created-by'];

    Api.addPlaylist(title.value, tracks, genres.value, coverImage.value, createdBy.value);

    title.value = '';
    playlistTrackSelect.removeActiveItems().clearInput();
    genres.value = '';
    coverImage.value = '';
    createdBy.value = '';
});

const createArtistSelect = (artists) => {
    const choices = artists.map(artist => {
        return {
            value: artist._id, label: `<p class="text-lg">${artist.name}</p>`,
            customProperties: {
                albums: artist.albums
            }
        }
    });

    artistSelect.setChoices(choices, 'value', 'label', true);
    trackArtistSelect.setChoices(choices, 'value', 'label', true);
}

const createAlbumSelect = (albums) => {
    const choices = albums.map(album => {
        return {
            value: album._id, label: `<p class="text-lg">${album.title}</p>`
        }
    });

    albumSelect.setChoices(choices, 'value', 'label', true);
}

const createTrackSelect = (tracks) => {
    const choices = tracks.map(track => {
        return {
            value: track._id,
            label: `<p class="font-semibold text-lg">${track.title}</p>
                    <p>${track.artists.map(artist => artist.name).join(', ')}</p>`,
        }
    });

    playlistTrackSelect.setChoices(choices, 'value', 'label', true);
}

const navLinks = document.querySelectorAll('#nav [data-view]');
navLinks.forEach(link =>
    link.addEventListener('click', () => View.switchView(link.getAttribute('data-view'))));

const formLinks = document.querySelectorAll('#form-links [data-view]');
formLinks.forEach(link =>
    link.addEventListener('click', () => {
        View.switchView(link.getAttribute('data-view'))
        const location = document.getElementById(link.getAttribute('data-location'));

        setTimeout(() => {
            location.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }));

const artistList = document.getElementById('artist-list');
View.showSpinner(artistList);
Api.getArtists().then(artists => View.displayArtists(artistList, artists));

const albumList = document.getElementById('album-list');
View.showSpinner(albumList);
Api.getAlbums().then(albums => View.displayAlbums(albumList, albums));

const trackList = document.getElementById('track-list');
View.showSpinner(trackList);
Api.getTracks().then(tracks => View.displayTracks(trackList, tracks));

const playlistList = document.getElementById('playlists-container');
View.showSpinner(playlistList);
Api.getPlaylists().then(playlists => View.displayPlaylists(playlistList, playlists));

const topTenPLaylistsContainer = document.getElementById('top-ten-playlists-container');
View.showSpinner(topTenPLaylistsContainer);
Api.getPlaylists().then(playlists => View.displayTopTenPlaylists(topTenPLaylistsContainer, playlists));

const topTenTracksContainer = document.getElementById('top-ten-tracks-container');
View.showSpinner(topTenTracksContainer);
Api.getTracks().then(tracks => View.displayTopTenTracks(topTenTracksContainer, tracks));

const topTenAlbumsContainer = document.getElementById('top-ten-albums-container');
View.showSpinner(topTenAlbumsContainer);
Api.getAlbums().then(albums => View.displayTopTenAlbums(topTenAlbumsContainer, albums));

Api.getArtists().then(artists => createArtistSelect(artists));
Api.getAlbums().then(albums => createAlbumSelect(albums));
Api.getTracks().then(tracks => createTrackSelect(tracks));