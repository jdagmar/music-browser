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
        return Api.responseToJson(fetch(`https://folksa.ga/api/${type}?key=flat_eric&limit=500&populateArtists=true`))
            .catch(() => {
                return [];
            });
    },
    searchArtistByName(name) {
        return Api.responseToJson(fetch(`https://folksa.ga/api/artists?name=${name}&key=flat_eric`))
            .catch(error => console.log(error));
    },
    searchByTitle(type, title) {
        return Api.responseToJson(fetch(`https://folksa.ga/api/${type}?title=${title}&key=flat_eric`))
            .catch(error => console.log(error));
    },
    searchByGenre(type, genre) {
        return Api.responseToJson(fetch(`https://folksa.ga/api/${type}?genres=${genre}&key=flat_eric`))
            .catch(error => console.log(error));
    },
    searchByPlaylistByUser(username) {
        return Api.responseToJson(fetch(`https://folksa.ga/api/playlists?createdBy=${username}&key=flat_eric`))
            .catch(error => console.log(error));
    },
    searchForArtists(searchWord) {
        return Promise.all([
            Api.searchArtistByName(searchWord),
            Api.searchByGenre('artists', searchWord),
        ]).then(result => {
            const nameResults = result[0];
            const genreResults = result[1];
            return nameResults.concat(genreResults);
        });
    },
    searchForAlbums(searchWord) {
        return Promise.all([
            Api.searchByTitle('albums', searchWord),
            Api.searchByGenre('albums', searchWord),
        ]).then(result => {
            const titleResults = result[0];
            const genreResults = result[1];
            return titleResults.concat(genreResults);
        });
    },
    searchForTracks(searchWord) {
        return Promise.all([
            Api.searchByTitle('tracks', searchWord),
            Api.searchByGenre('tracks', searchWord),
        ]).then(result => {
            const titleResults = result[0];
            const genreResults = result[1];
            return titleResults.concat(genreResults);
        });
    },
    searchForPlaylists(searchWord) {
        return Promise.all([
            Api.searchByTitle('playlists', searchWord),
            Api.searchByGenre('playlists', searchWord),
            Api.searchByPlaylistByUser(searchWord),
        ]).then(result => {
            const titleResults = result[0];
            const genreResults = result[1];
            const userResult = result[2];
            return titleResults.concat(genreResults).concat(userResult);
        });
    },
    searchAll(searchWord) {
        return Promise.all([
            Api.searchForArtists(searchWord),
            Api.searchForAlbums(searchWord),
            Api.searchForTracks(searchWord),
            Api.searchForPlaylists(searchWord)
        ]).then(result => {
            return {
                artists: result[0],
                albums: result[1],
                tracks: result[2],
                playlists: result[3],
                searchWord: searchWord
            }
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
        const notificationGlobalFail = document.querySelector('.notification-global-fail');
        notificationGlobalFail.classList.remove('hidden');

        setTimeout(() => {
            notificationGlobalFail.classList.add('hidden');
        }, 3000);

        return Promise.reject(respone);
    },
    successHandler() {
        const notificationGlobalSuccess = document.querySelector('.notification-global-success');
        notificationGlobalSuccess.classList.remove('hidden');

        setTimeout(() => {
            notificationGlobalSuccess.classList.add('hidden');
        }, 3000);
    }
}