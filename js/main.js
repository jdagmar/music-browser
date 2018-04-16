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

const addAlbumForm = document.getElementById('add-album-form');
const artistSelect = new Choices('#artist-select', {
    position: 'bottom'
});

addAlbumForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = addAlbumForm.elements['album-title'];
    const artists = artistSelect.getValue(true).join(',');
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

albumSelect.passedElement.addEventListener('choice', event => {
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

addTrackForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = addTrackForm.elements['track-title'];
    const artists = trackArtistSelect.getValue(true).join(',');
    const album = albumSelect.getValue(true);
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

    notifactionEmptyTrackTitle.classList.add('hidden');
    notificationEmptyAlbumTitle.classList.add('hidden');
    notificationEmptyTrackArtists.classList.add('hidden');

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

addPlaylistForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = addPlaylistForm.elements['playlist-title'];
    const tracks = playlistTrackSelect.getValue(true).join(',');
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

const createTrackSelect = tracks => {
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

const tabLinks = document.querySelectorAll('#tab-menu [data-view]');
tabLinks.forEach(link =>
    link.addEventListener('click', () => View.switchView(link.getAttribute('data-view'))));

const notifications = Array.from(document.querySelectorAll('.notification'));
notifications.forEach(notification =>
    notification.querySelector('.hide-notification').addEventListener('click', () => {
        notification.classList.add('hidden');
    }));

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
Api.getArtists().then(artists => View.displayArtists(artistList, artists, (artistId, artistContainer) => {
    Api.deleteArtist(artistId)
        .then(() => artistContainer.parentNode.removeChild(artistContainer));
}));

const albumList = document.getElementById('album-list');
View.showSpinner(albumList);
Api.getAlbums().then(albums => View.displayAlbums(albumList, albums, (albumId, vote) => {
    Api.voteOnAlbum(albumId, vote);
}));

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

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    View.switchView('search-view');
    const searchField = document.getElementById('search-field');
    const searchWord = searchField.value;
    Api.searchAll(searchWord).then(result => View.displaySearchResults(result));
});