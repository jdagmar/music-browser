const Api = {
    getArtists: () => Api.get('artists'),
    getAlbums: () => Api.get('albums'),
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
    }
}

Api.getArtists().then(artists => View.displayArtists(artists));
Api.getAlbums().then(albums => View.displayAlbums(albums));