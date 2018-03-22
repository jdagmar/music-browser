const Api = {
    getArtists: () => Api.get('artists'),
    getAlbums: () => Api.get('albums'),
    getTracks: () => Api.get('tracks'),
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
            const artistItem = document.createElement('p');
            const artistName = document.createTextNode(artist.name);
            artistItem.appendChild(artistName);
            return artistItem;
        });

        const artistsList = document.getElementById('all-artists');
        listAllArtist.forEach(artistItem => artistsList.appendChild(artistItem));
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
    }
}

Api.getArtists().then(artists => View.displayArtists(artists));
Api.getAlbums().then(albums => View.displayAlbums(albums));
Api.getTracks().then(tracks => View.displayTracks(tracks));