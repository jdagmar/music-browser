'use strict';
const Forms = {
    init(albums, artists, tracks, onSearch, onArtistAdd, onAlbumAdd, onTrackAdd, onPlaylistAdd) {
        Forms.createSearchForm(onSearch);
        Forms.createArtistForm(onArtistAdd);
        Forms.createAlbumForm(artists, onAlbumAdd);
        Forms.createTrackForm(albums, artists, onTrackAdd);
        Forms.createPlaylistForm(tracks, onPlaylistAdd);
    },
    createSearchForm(onSearch) {
        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', event => {
            event.preventDefault();
            const searchField = document.getElementById('search-field');
            const searchWord = searchField.value.trim();

            // if searchfield is empty on submit the function won't run
            if (!searchWord) {
                return;
            }

            View.switchView('search-view');
            onSearch(searchWord);
            searchField.value = '';
        });
    },
    createArtistForm(onArtistAdd) {
        /* selects genderselect in add-artist form and makes it a 
        choices.js instance */
        const addArtistForm = document.getElementById('add-artist-form');
        const genderChoices = new Choices('#artist-gender', {
            searchEnabled: false
        });

        addArtistForm.addEventListener('submit', event => {
            event.preventDefault();
            const name = addArtistForm.elements['artist-name'];
            const born = addArtistForm.elements['artist-birthdate'];
            const genres = addArtistForm.elements['artist-genres'];
            const gender = genderChoices.getValue(true);
            const countryBorn = addArtistForm.elements['artist-country'];
            const spotifyURL = addArtistForm.elements['artist-spotify'];
            const artistImage = addArtistForm.elements['artist-image'];

            const notifactionEmptyName = document.querySelector('.notification-empty-name');
            const notifactionWrongDate = document.querySelector('.notification-wrong-date');
            const notificationEmptyGender = document.querySelector('.notification-empty-gender');

            let isValid = true;

            if (!Utils.isFieldEmpty(name.value)) {
                notifactionEmptyName.classList.remove('hidden');
                isValid = false;
            }

            if (!Utils.isDateValid(born.value)) {
                notifactionWrongDate.classList.remove('hidden');
                isValid = false;
            }

            /* not possible to use isSelectEmpty or similar since placeholder value
            gets chosen */
            if (gender === 'Gender'){
                notificationEmptyGender.classList.remove('hidden');
                isValid = false;
            }

            /* makes sure all error notifications are shown if none of the required 
            fields are filled in on submit */
            if (!isValid) {
                return;
            }

            // in order to isolate Forms from Api onArtistAdd is used as callback
            onArtistAdd({
                name: name.value, born: born.value, genres: genres.value, gender: gender.value,
                countryBorn: countryBorn.value, spotifyUrl: spotifyURL.value, artistImage: artistImage.value
            });

            notifactionEmptyName.classList.add('hidden');
            notifactionWrongDate.classList.add('hidden');
            notificationEmptyGender.classList.add('hidden');
            name.value = '';
            born.value = '';
            genres.value = '';
            gender.value = '';
            countryBorn.value = '';
            spotifyURL.value = '';
            artistImage.value = '';
        });
    },
    createAlbumForm(artists, onAlbumAdd) {
        // creates a choices.js select with all artists in Api
        View.createArtistSelect(artists);
        const addAlbumForm = document.getElementById('add-album-form');

        addAlbumForm.addEventListener('submit', event => {
            event.preventDefault();
            const title = addAlbumForm.elements['album-title'];
            const artists = View.getArtistSelect().getValue(true).join(',');
            const releaseDate = addAlbumForm.elements['album-release'];
            const genres = addAlbumForm.elements['album-genres'];
            const spotifyURL = addAlbumForm.elements['album-spotify'];
            const coverImage = addAlbumForm.elements['album-cover'];

            const notifactionEmptyTitle = document.querySelector('.notification-empty-title');
            const notifactionEmptyArtists = document.querySelector('.notification-empty-artists');

            let isValid = true;

            if (!Utils.isFieldEmpty(title.value)) {
                notifactionEmptyTitle.classList.remove('hidden');
                isValid = false;
            }

            if (!Utils.isFieldEmpty(artists)) {
                notifactionEmptyArtists.classList.remove('hidden');
                isValid = false;
            }

            /* makes sure all error notifications are shown if none of the required 
            fields are filled in on submit */
            if (!isValid) {
                return;
            }

            // in order to isolate Forms from Api onAlbumAdd is used as callback
            onAlbumAdd({
                title: title.value, artist: artists, releaseDate: releaseDate.value, genre: genres.value,
                spotifyURL: spotifyURL.value, coverImage: coverImage.value
            });

            notifactionEmptyTitle.classList.add('hidden');
            notifactionEmptyArtists.classList.add('hidden');
            title.value = '';
            View.getArtistSelect().removeActiveItems().clearInput();
            releaseDate.value = '';
            genres.value = '';
            spotifyURL.value = '';
            coverImage.value = '';
        });
    },
    createTrackForm(albums, artists, onTrackAdd) {
        // creates choices.js selects with all artists with matching albums in API
        View.createAlbumSelect(albums);
        View.createTrackArtistSelect(artists);
        const addTrackForm = document.getElementById('add-track-form');

        addTrackForm.addEventListener('submit', event => {
            event.preventDefault();
            const title = addTrackForm.elements['track-title'];
            const artists = View.getTrackArtistSelect().getValue(true).join(',');
            const album = View.getAlbumSelect().getValue(true);
            const genres = addTrackForm.elements['track-genres'];
            const coverImage = addTrackForm.elements['track-cover-image'];
            const spotifyURL = addTrackForm.elements['track-spotify'];
            const youtubeURL = addTrackForm.elements['track-youtube'];

            const notificationEmptyTrackTitle = document.querySelector('.notification-empty-track-title');
            const notificationEmptyAlbumTitle = document.querySelector('.notification-empty-album-title');
            const notificationEmptyTrackArtists = document.querySelector('.notification-empty-track-artists');

            let isValid = true;

            if (!Utils.isFieldEmpty(title.value)) {
                notificationEmptyTrackTitle.classList.remove('hidden');
                isValid = false;
            }

            if (!Utils.isSelectEmpty(album)) {
                notificationEmptyAlbumTitle.classList.remove('hidden');
                isValid = false;
            }

            if (!Utils.isSelectEmpty(artists)) {
                notificationEmptyTrackArtists.classList.remove('hidden');
                isValid = false;
            }

            /* makes sure all error notifications are shown if none of the required 
            fields are filled in on submit */
            if (!isValid) {
                return;
            }

            // in order to isolate Forms from Api onTrackAdd is used as callback
            onTrackAdd({
                title: title.value, artists: artists, album: album, genres: genres.value,
                coverImage: coverImage.value, spotifyURL: spotifyURL.value, youtubeURL: youtubeURL.value
            });

            notificationEmptyTrackTitle.classList.add('hidden');
            notificationEmptyAlbumTitle.classList.add('hidden');
            notificationEmptyTrackArtists.classList.add('hidden');

            title.value = '';
            View.getTrackArtistSelect().removeActiveItems().clearInput();
            View.getAlbumSelect().removeActiveItems().clearInput();
            genres.value = '';
            coverImage.value = '';
            spotifyURL.value = '';
            youtubeURL.value = '';
        });
    },
    createPlaylistForm(tracks, onPlaylistAdd) {
        // creates a choices.js select with all tracks with matching artists in API
        View.createPlaylistTrackSelect(tracks);
        const addPlaylistForm = document.getElementById('add-playlist-form');

        addPlaylistForm.addEventListener('submit', event => {
            event.preventDefault();
            const title = addPlaylistForm.elements['playlist-title'];
            const tracks = View.getPLaylistTrackSelect().getValue(true).join(',');
            const genres = addPlaylistForm.elements['playlist-genres'];
            const coverImage = addPlaylistForm.elements['playlist-cover-image'];
            const createdBy = addPlaylistForm.elements['playlist-created-by'];

            const notificationEmptyPlaylistTitle = document.querySelector('.notification-empty-playlist-title');
            const notificationEmptyPlaylistUsername = document.querySelector('.notification-empty-playlist-username');

            let isValid = true;

            if (!Utils.isFieldEmpty(title.value)) {
                notificationEmptyPlaylistTitle.classList.remove('hidden');
                isValid = false;
            }

            if (!Utils.isFieldEmpty(createdBy.value)) {
                notificationEmptyPlaylistUsername.classList.remove('hidden');
                isValid = false;
            }

            /* makes sure all error notifications are shown if none of the required 
            fields are filled in on submit */
            if (!isValid) {
                return;
            }

            // in order to isolate Forms from Api onPlaylistAdd is used as callback
            onPlaylistAdd({
                title: title.value, tracks: tracks, genres: genres.value, coverImage: coverImage.value,
                createdBy: createdBy.value
            });

            notificationEmptyPlaylistTitle.classList.add('hidden');
            notificationEmptyPlaylistUsername.classList.add('hidden');
            title.value = '';
            View.getPlaylistTrackSelect().removeActiveItems().clearInput();
            genres.value = '';
            coverImage.value = '';
            createdBy.value = '';
        });
    }
}