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
            const albumItem = document.createElement('p');
            const albumName = document.createTextNode(album.title);
            albumItem.appendChild(albumName);
            return albumItem;
        });

        const albumList = document.getElementById('all-albums');
        listAllAlbums.forEach(albumItem => albumList.appendChild(albumItem));
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