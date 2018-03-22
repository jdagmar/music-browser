const Api = {
    getArtists: () => Api.get('artists'),
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
    }
    
}

Api.getArtists().then(artists => View.displayArtists(artists));