const Api = {
    getArtists: () => Api.get('artists'),
    getAlbums: () => Api.get('albums'),
    getTracks: () => Api.get('tracks'),
    getPlaylists: () => Api.get('playlists'),
    get(type){
        return fetch(`https://folksa.ga/api/${type}?key=flat_eric`)
            .then(response => response.json())
            .catch(error => {
                console.log('error');
                return [];
            });
    }
}

const View = {
    displayArtists(artists){
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
        const artistList = document.getElementById('all-artists');
        artistList.innerHTML = '';
        listAllArtist.forEach(artistContainer => artistList.appendChild(artistContainer));
    },
    displayAlbums(albums){
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

        const albumList = document.getElementById('all-albums');
        albumList.innerHTML = '';
        listAllAlbums.forEach(albumContainer => albumList.appendChild(albumContainer));
    },
    displayTracks(tracks){
        const listAllTracks = tracks.map(track => {
            const trackItem = document.createElement('p');
            const trackName = document.createTextNode(track.title);
            trackItem.appendChild(trackName);
            return trackItem;
        });

        const trackList = document.getElementById('all-tracks');
        listAllTracks.forEach(trackItem => trackList.appendChild(trackItem));
    },
    displayPlaylists(playlists){
        const listAllPlaylists = playlists.map(playlist => {
            const playlistItem = document.createElement('p');
            const playlistName = document.createTextNode(playlist.title);
            playlistItem.appendChild(playlistName);
            return playlistItem;
        });

        const playlistList = document.getElementById('all-playlists');
        listAllPlaylists.forEach(playlistItem => playlistList.appendChild(playlistItem));
    }
}

Api.getArtists().then(artists => View.displayArtists(artists));
Api.getAlbums().then(albums => View.displayAlbums(albums));
Api.getTracks().then(tracks => View.displayTracks(tracks));
Api.getPlaylists().then(playlists => View.displayPlaylists(playlists));