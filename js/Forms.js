const Forms = {
    init(albums, artists, tracks) {
        Forms.createSearchForm();
        Forms.createArtistForm();
        Forms.createAlbumForm(artists);
        Forms.createTrackForm(albums, artists);
        Forms.createPlaylistForm(tracks);
    },
    createSearchForm() {
        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', event => {
            event.preventDefault();
            View.switchView('search-view');
            const searchField = document.getElementById('search-field');
            const searchWord = searchField.value;
            Api.searchAll(searchWord).then(result => View.displaySearchResults(result));
        });
    },
    createArtistForm() {
        const addArtistForm = document.getElementById('add-artist-form');
        const genderChoices = new Choices('#artist-gender', {
            searchEnabled: false
        });

        addArtistForm.addEventListener('submit', event => {
            event.preventDefault();
            const name = addArtistForm.elements['artist-name'];
            const born = addArtistForm.elements['artist-birthdate'];
            const genres = addArtistForm.elements['artist-genres'];
            const gender = addArtistForm.elements['artist-gender'];
            const countryBorn = addArtistForm.elements['artist-country'];
            const spotifyURL = addArtistForm.elements['artist-spotify'];
            const artistImage = addArtistForm.elements['artist-image'];

            const notifactionEmptyName = document.querySelector('.notification-empty-name');
            const notifactionWrongDate = document.querySelector('.notification-wrong-date');

            if (!Utils.isFieldEmpty(name.value)) {
                notifactionEmptyName.classList.remove('hidden');
                return;
            }

            if (!Utils.isDateValid(born.value)) {
                notifactionWrongDate.classList.remove('hidden');
                return;
            }

            Api.addArtist(name.value, born.value, genres.value, gender.value, countryBorn.value,
                spotifyURL.value, artistImage.value);

            notifactionEmptyName.classList.add('hidden');
            notifactionWrongDate.classList.add('hidden');
            name.value = '';
            born.value = '';
            genres.value = '';
            gender.value = '';
            countryBorn.value = '';
            spotifyURL.value = '';
            artistImage.value = '';
        });
    },
    createAlbumForm(artists) {
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

            if (!Utils.isFieldEmpty(title.value)) {
                notifactionEmptyTitle.classList.remove('hidden');
                return;
            }

            if (!Utils.isFieldEmpty(artists)) {
                notifactionEmptyArtists.classList.remove('hidden');
                return;
            }

            Api.addAlbum(title.value, artists, releaseDate.value, genres.value, spotifyURL.value,
                coverImage.value);

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
    createTrackForm(albums, artists) {
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
            const soundcloudURL = addTrackForm.elements['track-soundcloud'];

            const notificationEmptyTrackTitle = document.querySelector('.notification-empty-track-title');
            const notificationEmptyAlbumTitle = document.querySelector('.notification-empty-album-title');
            const notificationEmptyTrackArtists = document.querySelector('.notification-empty-track-artists');

            if (!Utils.isFieldEmpty(title.value)) {
                notificationEmptyTrackTitle.classList.remove('hidden');
                return;
            }

            if (!Utils.isSelectEmpty(album)) {
                notificationEmptyAlbumTitle.classList.remove('hidden');
                return;
            }

            if (!Utils.isSelectEmpty(artists)) {
                notificationEmptyTrackArtists.classList.remove('hidden');
                return;
            }

            Api.addTrack(title.value, artists, album, genres.value, coverImage.value,
                spotifyURL.value, youtubeURL.value);

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
            soundcloudURL.value = '';
        });
    },
    createPlaylistForm(tracks) {
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

            if (!Utils.isFieldEmpty(title.value)) {
                notificationEmptyPlaylistTitle.classList.remove('hidden');
                return;
            }

            if (!Utils.isFieldEmpty(createdBy.value)) {
                notificationEmptyPlaylistUsername.classList.remove('hidden');
                return;
            }

            Api.addPlaylist(title.value, tracks, genres.value, coverImage.value, createdBy.value);

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