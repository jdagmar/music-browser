
const View = {
    init() {
        // adds dismissbutton to all notifications which can be dismissed
        const notifications = Array.from(document.querySelectorAll('.notification'));
        notifications.forEach(notification =>
            notification.querySelector('.hide-notification').addEventListener('click', () => {
                notification.classList.add('hidden');
            }));
    },
    displayArtists(artistList, artists, onArtistDelete) {
        const listAllArtist = artists.map(artist => {
            const artistContainer = document.querySelector('.artist-container-template').cloneNode(true);
            artistContainer.classList.remove('artist-container-template');

            const artistImage = artistContainer.querySelector('.artist-image');
            artistImage.src = artist.coverImage;
            artistImage.alt = artist.name;

            /* if user don't include image of artist och submits a invalid image src
            a placeholder image is set */
            artistImage.onerror = () => {
                artistImage.onerror = undefined;
                artistImage.src = 'images/103__user.svg';
                artistImage.alt = 'no image was uploaded, fallback image of user icon is in use';
            }

            const artistImageCaption = artistContainer.querySelector('.artist-image-caption');
            artistImageCaption.innerHTML = artist.name;

            const artistSpotifyLink = artistContainer.querySelector('.artist-spotify-url');
            const artistSpotifyUrl = artist.spotifyURL;
            artistSpotifyLink.href = artistSpotifyUrl;

            /* if artist has a spotifyUrl and that url is formatted correctly a link to
            the artist spotify is rendered */
            if (artistSpotifyUrl !== undefined && Utils.isSpotifyUrlValid(artistSpotifyUrl)) {
                artistSpotifyLink.innerHTML =
                    `Open in Spotify <img class="align-text-bottom w-4"
                    src="images/ic_library_music_black.svg"/>`;
            };

            const deleteArtistButton = artistContainer.querySelector('.delete-artist');
            deleteArtistButton.addEventListener('click', () => {
                onArtistDelete(artist._id, artistContainer);
            });

            return artistContainer;
        });
        artistList.innerHTML = '';
        listAllArtist.forEach(artistContainer => artistList.appendChild(artistContainer));
    },
    displayAlbums(albumList, albums, onAlbumVote, onAlbumDelete) {
        const listAllAlbums = albums.map(album => {
            const albumContainer = document.querySelector('.album-container-template').cloneNode(true);
            albumContainer.classList.remove('album-container-template');

            const albumImage = albumContainer.querySelector('.album-image');
            albumImage.src = album.coverImage;
            albumImage.alt = album.title;

            /* if user don't include albumcover of and submits a invalid image src
            (ie returns undefines) a placeholder image is set */
            albumImage.onerror = () => {
                albumImage.onerror = undefined;
                albumImage.src = 'images/ic_album_black.svg';
                albumImage.alt = 'no image was uploaded, fallback image of note icon is in use';
            }

            const albumTitle = albumContainer.querySelector('.album-title');
            albumTitle.innerHTML = album.title;

            const albumArtists = albumContainer.querySelector('.album-artists');
            albumArtists.innerHTML = album.artists.map(artist => artist.name).join(', ');

            const albumRating = albumContainer.querySelector('.album-rating');
            albumRating.innerHTML = `Rating: ${Utils.getAverageRating(album)} / 10`;

            const albumSpotifyLink = albumContainer.querySelector('.album-spotify-url');
            const albumSpotifyUrl = album.spotifyURL;
            albumSpotifyLink.href = albumSpotifyUrl;

            /* if artist has a spotifyUrl and that url is formatted correctly a link to
            the artist spotify is rendered */
            if (albumSpotifyUrl !== undefined && Utils.isSpotifyUrlValid(albumSpotifyUrl)) {
                albumSpotifyLink.innerHTML =
                    `Open in Spotify <img class="align-text-bottom w-4"
                        src="images/ic_library_music_black.svg"/>`;
            };

            const deleteAlbumButton = albumContainer.querySelector('.delete-album');
            deleteAlbumButton.addEventListener('click', () => {
                onAlbumDelete(album._id, albumContainer);
            });

            // makes a new choices.js instance
            const albumRatingSelect = new Choices(albumContainer.querySelector('.album-vote'), {
                position: 'bottom',
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false
            });

            const albumVoteForm = albumContainer.querySelector('.album-vote-form');
            albumVoteForm.addEventListener('choice', event => {
                event.preventDefault();
                const vote = event.detail.choice.value;
                onAlbumVote(album._id, vote);
            });

            return albumContainer;
        });

        albumList.innerHTML = '';
        listAllAlbums.forEach(albumContainer => albumList.appendChild(albumContainer));
    },
    displayTracks(trackList, tracks, onTrackVote, onTrackDelete) {
        const listAllTracks = tracks.map(track => {
            const trackItem = document.querySelector('.track-item-template').cloneNode(true);
            trackItem.classList.remove('track-item-template');

            const trackRate = trackItem.querySelector('.track-rate');
            const trackTitle = trackItem.querySelector('.track-title');
            const trackArtist = trackItem.querySelector('.track-artist');

            trackTitle.innerHTML = track.title;
            // renders either track artist or 'artist not found' if the artist is deleted from Api
            trackArtist.innerHTML = track.artists.length > 0 ? track.artists.map(artist => artist.name).join(', ') : 'No artist found'
            trackRate.innerHTML = `${Utils.getAverageRating(track)} / 10`;

            const showMoreButton = trackItem.querySelector('.show-more');
            const moreContent = trackItem.querySelector('.more-content');
            showMoreButton.addEventListener('click', () => {
                if (moreContent.classList.contains('hidden')) {
                    moreContent.classList.remove('hidden');
                } else {
                    moreContent.classList.add('hidden');
                }
            });

            const deleteTrackButton = trackItem.querySelector('.delete-track');
            deleteTrackButton.addEventListener('click', () => {
                onTrackDelete(track._id, trackItem);
            });

            // creates a new choices.js instance
            const trackRatingSelect = new Choices(trackItem.querySelector('.track-rating'), {
                position: 'bottom',
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false
            });

            const trackVoteForm = trackItem.querySelector('.track-vote-form');
            trackVoteForm.addEventListener('choice', event => {
                event.preventDefault();
                const vote = event.detail.choice.value;
                onTrackVote(track._id, vote.value);
            });

            return trackItem;
        });

        trackList.innerHTML = '';
        listAllTracks.forEach(trackItem => trackList.appendChild(trackItem));
    },
    displayPlaylistComments(commentSection, comments, onCommentDelete) {
        const listAllComments = comments.map(comment => {
            const commentItem = document.querySelector('.comment-item-template').cloneNode(true);
            commentItem.classList.remove('comment-item-template');

            const username = commentItem.querySelector('.username');
            username.innerHTML = comment.username;

            const commentText = commentItem.querySelector('.comment-text');
            commentText.innerHTML = comment.body;

            const deleteCommentButton = commentItem.querySelector('.delete-comment');
            deleteCommentButton.addEventListener('click', () => {
                onCommentDelete(comment, commentItem);
            });

            return commentItem;
        });

        const commentField = commentSection.querySelector('.comment-field');
        const commentFieldHeading = commentSection.querySelector('.comment-field-heading');
        commentFieldHeading.innerHTML = comments.length > 0 ? `Comments (${comments.length})` : 'No comments yet';

        commentField.innerHTML = '';
        listAllComments.forEach(comment => commentField.appendChild(comment));
    },
    displayPlaylists(playlistList, playlists, onCommentDelete, onPlaylistVote, onPlaylistDelete,
        onPostPlaylistComment) {
        const listAllPlaylists = playlists.map(playlist => {
            const playlistItem = document.querySelector('.playlist-container-template').cloneNode(true);
            playlistItem.classList.remove('playlist-container-template');
            // saves id for each playlist so it can be linked to in search/top-ten-playlists
            playlistItem.id = `playlist-${playlist._id}`;

            const playlistCover = playlistItem.querySelector('.playlist-cover');
            playlistCover.src = playlist.coverImage;
            playlistCover.alt = `Coverimage for the playlist ${playlist.title}`;

            /* if user don't include image of artist and submits a invalid image src
            a placeholder image is set */
            playlistCover.onerror = () => {
                playlistCover.onerror = undefined;
                playlistCover.src = 'images/144__headphone.svg';
                playlistCover.alt = 'no image was uploaded, fallback image of headphones icon is in use';
            }

            const playlistTitle = playlistItem.querySelector('.playlist-title');
            playlistTitle.innerHTML = playlist.title;

            const playlistRating = playlistItem.querySelector('.playlist-rating');
            playlistRating.innerHTML = `Rating: ${Utils.getAverageRating(playlist)} / 10`;

            const playlistTracklistCount = playlistItem.querySelector('.playlist-tracklist-count');
            const tracksCounter = playlist.tracks.length;
            const numberOfSongs = (tracksCounter === 1 ? 'track' : 'tracks');
            playlistTracklistCount.innerHTML = (tracksCounter < 0 ? `${playlist.tracks.length} ${numberOfSongs}` : '');

            const showMoreButton = playlistItem.querySelector('.show-more');
            const moreContent = playlistItem.querySelector('.more-content');

            showMoreButton.addEventListener('click', () => {
                if (moreContent.classList.contains('hidden')) {
                    moreContent.classList.remove('hidden');
                } else {
                    moreContent.classList.add('hidden');
                }
            });

            // creates a new choices.js instance
            const playlistRatingSelect = new Choices(playlistItem.querySelector('.playlist-vote'), {
                position: 'bottom',
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false
            });

            const playlistVoteForm = playlistItem.querySelector('.playlist-vote-form');
            playlistVoteForm.addEventListener('choice', event => {
                event.preventDefault();
                const vote = event.detail.choice.value;
                onPlaylistVote(playlist, vote);
            });

            const playlistCreator = playlistItem.querySelector('.playlist-creator');
            playlistCreator.innerHTML = `Created by ${playlist.createdBy}`

            const genres = playlist.genres.map(genres => genres).join(', ');

            if (genres.length > 0) {
                const playlistGenres = playlistItem.querySelector('.playlist-genres');
                playlistGenres.innerHTML = `Genres: ${genres}`;
            }

            const deletePlaylistButton = playlistItem.querySelector('.delete-playlist');
            deletePlaylistButton.addEventListener('click', () => {
                onPlaylistDelete(playlist, playlistItem);
            });

            const playlistContainer = playlistItem.querySelector('.playlist');

            const commentSection = playlistItem.querySelector('.comment-section');
            View.displayPlaylistComments(commentSection, playlist.comments, onCommentDelete);

            const commentForm = playlistItem.querySelector('.comment-form');

            commentForm.addEventListener('submit', event => {
                event.preventDefault();
                const username = commentForm.elements.username;
                const body = commentForm.elements.body;

                const notifactionEmptyUser = document.querySelector('.notification-empty-username');
                const notifactionEmptyBody = document.querySelector('.notification-empty-body');

                let isValid = true;

                if (!Utils.isFieldEmpty(username.value)) {
                    notifactionEmptyUser.classList.remove('hidden');
                    isValid = false;
                }

                if (!Utils.isFieldEmpty(body.value)) {
                    notifactionEmptyBody.classList.remove('hidden');
                    isValid = false;
                }

                /* makes sure all error notifications are shown if none of the required 
                fields are filled in on submit */
                if (!isValid) {
                    return;
                }

                // in order to isolate Forms from Api onPostPlaylistComment is used as callback
                onPostPlaylistComment(playlist, body, username, commentSection, onCommentDelete);

                notifactionEmptyUser.classList.add('hidden');
                notifactionEmptyBody.classList.add('hidden');
                username.value = '';
                body.value = '';
            });

            /* if playlist is missing tracks the 'tablehead' in tracklist is hidden and user 
            gets a message */
            if (playlist.tracks.length === 0) {
                const playlistTrackHead = playlistItem.querySelector('.playlist-track-head');
                playlistTrackHead.classList.add('hidden');
                const noTracksMessage = playlistItem.querySelector('.no-tracks');
                noTracksMessage.innerHTML = `${playlist.createdBy} haven't added any tracks yet`;
            }

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
            'all-playlists',
            'search-view'
        ];

        views.filter(view => view !== currentView)
            .forEach(view =>
                document.getElementById(view).classList.add('hidden'));

        const viewElement = document.getElementById(currentView);
        viewElement.classList.remove('hidden');

        // adds styling on nav-/tablink when page is active
        Array.from(document.querySelectorAll(`[data-view]`)).forEach(viewLink => {
            viewLink.classList.remove('underline');
            viewLink.classList.remove('bg-grey-light');
        });

        Array.from(document.querySelectorAll(`#tab-menu [data-view="${currentView}"]`))
            .forEach(viewLink => viewLink.classList.add('bg-grey-light'));

        Array.from(document.querySelectorAll(`#nav [data-view="${currentView}"]`))
            .forEach(viewLink => viewLink.classList.add('underline'));
    },
    displayTopTenPlaylists(topTenPLaylistsContainer, playlists) {
        playlists.sort(Utils.compareAverageRating);

        const topTenPLaylists = playlists.filter(playlist => Utils.getAverageRating(playlist) > 0)
            .slice(0, 10)
            .map(playlist => {
                const topTenPLaylistsItem = document.querySelector('.top-ten-playlist-item-template').cloneNode(true);
                topTenPLaylistsItem.classList.remove('top-ten-playlist-item-template');

                const topTenPLaylistsItemTitle = topTenPLaylistsItem.querySelector('.top-ten-playlist-title');
                topTenPLaylistsItemTitle.innerHTML = playlist.title;

                // links to all-playlist view and scrolls to the scrollpostion for playlist
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
                topTenPLaylistsItemRating.innerHTML = `${Utils.getAverageRating(playlist)} / 10`;

                return topTenPLaylistsItem;
            });

        topTenPLaylistsContainer.innerHTML = '';
        topTenPLaylists.forEach(topTenPLaylistsItem => topTenPLaylistsContainer.appendChild(topTenPLaylistsItem));
    },
    displayTopTenTracks(topTenTracksContainer, tracks) {
        tracks.sort(Utils.compareAverageRating);

        const topTenTracks = tracks.filter(tracks => Utils.getAverageRating(tracks) > 0)
            .slice(0, 10)
            .map(tracks => {
                const topTenTracksItem = document.querySelector('.top-ten-tracks-item-template').cloneNode(true);
                topTenTracksItem.classList.remove('top-ten-tracks-item-template');

                const topTenTracksItemTitle = topTenTracksItem.querySelector('.top-ten-track-title');
                topTenTracksItemTitle.innerHTML = tracks.title;

                const topTenTracksItemArtist = topTenTracksItem.querySelector('.top-ten-track-artist');
                topTenTracksItemArtist.innerHTML = tracks.artists.map(artist => artist.name).join(', ');

                const topTenTracksItemRating = topTenTracksItem.querySelector('.top-ten-track-rating');
                topTenTracksItemRating.innerHTML = `${Utils.getAverageRating(tracks)} / 10`;

                return topTenTracksItem;
            });

        topTenTracksContainer.innerHTML = '';
        topTenTracks.forEach(topTenTracksItem => topTenTracksContainer.appendChild(topTenTracksItem));
    },
    displayTopTenAlbums(topTenAlbumsContainer, albums) {
        albums.sort(Utils.compareAverageRating);

        const topTenAlbums = albums.filter(albums => Utils.getAverageRating(albums) > 0)
            .slice(0, 10)
            .map(albums => {
                const topTenAlbumsItem = document.querySelector('.top-ten-albums-item-template').cloneNode(true);
                topTenAlbumsItem.classList.remove('top-ten-albums-item-template');

                const topTenAlbumsItemTitle = topTenAlbumsItem.querySelector('.top-ten-album-title');
                topTenAlbumsItemTitle.innerHTML = albums.title;

                const topTenAlbumsItemArtist = topTenAlbumsItem.querySelector('.top-ten-album-artist');
                topTenAlbumsItemArtist.innerHTML = albums.artists.map(artist => artist.name).join(', ');

                const topTenAlbumsItemRating = topTenAlbumsItem.querySelector('.top-ten-album-rating');
                topTenAlbumsItemRating.innerHTML = `${Utils.getAverageRating(albums)} / 10`;

                return topTenAlbumsItem;
            });

        topTenAlbumsContainer.innerHTML = '';
        topTenAlbums.forEach(topTenAlbumsItem => topTenAlbumsContainer.appendChild(topTenAlbumsItem));
    },
    displayPlaylistsAsGrid(playlistContainerInSearch, playlists) {
        const listAllPaylistsInSearch = playlists.map(playlist => {
            const playlistItemInSearchResult = document.querySelector('.playlist-container-template--search').cloneNode(true);
            playlistItemInSearchResult.classList.remove('search-playlist-container-template');

            const playlistCoverSearch = playlistItemInSearchResult.querySelector('.playlist-cover--search');
            playlistCoverSearch.src = playlist.coverImage;
            playlistCoverSearch.alt = `Playlist imagecover for ${playlist.title}`;

            /* if user don't include a playlist coverimage and submits a invalid image src
            a placeholder image is set */
            playlistCoverSearch.onerror = () => {
                playlistCoverSearch.onerror = undefined;
                playlistCoverSearch.src = 'images/144__headphone.svg';
                playlistCoverSearch.alt = 'no image was uploaded, fallback image of user icon is in use';
            }

            // links to all-playlist view and scrolls to the scrollpostion for playlist
            playlistItemInSearchResult.addEventListener('click', () => {
                View.switchView('all-playlists');

                setTimeout(() => {
                    const playlistLocation = document.getElementById(`playlist-${playlist._id}`);
                    playlistLocation.scrollIntoView({ behavior: 'smooth' });
                });
            });

            const playlistTitleSearch = playlistItemInSearchResult.querySelector('.playlist-title--search');
            playlistTitleSearch.innerHTML = playlist.title;

            const playlistAuthorSearch = playlistItemInSearchResult.querySelector('.playlist-author--search');
            playlistAuthorSearch.innerHTML = `Created by ${playlist.createdBy}`;

            return playlistItemInSearchResult;
        });

        playlistContainerInSearch.innerHTML = '';
        listAllPaylistsInSearch.forEach(playlistItemInSearchResult => playlistContainerInSearch.appendChild(playlistItemInSearchResult));

    },
    // returns all searchsections inside searchView
    getSearchResultsContainers() {
        return {
            searchArtistContainer: document.getElementById('search-artist-container'),
            searchAlbumContanier: document.getElementById('search-album-container'),
            searchTrackContainer: document.getElementById('search-track-container'),
            searchPlaylistContainer: document.getElementById('search-playlist-container')
        }
    },
    displaySearchResults(result) {
        const searchResultsContainers = View.getSearchResultsContainers();

        const foundArtists = result.artists;
        View.displayArtists(searchResultsContainers.searchArtistContainer, foundArtists);
        const searchArtistHeader = document.getElementById('search-artist-header');
        searchArtistHeader.innerHTML = foundArtists.length > 0 ? `Artists (${foundArtists.length})` : '';

        const foundAlbums = result.albums;
        View.displayAlbums(searchResultsContainers.searchAlbumContanier, foundAlbums);
        const searchAlbumHeader = document.getElementById('search-album-header');
        searchAlbumHeader.innerHTML = foundAlbums.length > 0 ? `Albums (${foundAlbums.length})` : '';

        const foundTracks = result.tracks;
        View.displayTracks(searchResultsContainers.searchTrackContainer, foundTracks);

        const searchTrackContainerTableHead = document.getElementById('search-track-container-table-head');
        foundTracks.length > 0 ? searchTrackContainerTableHead.classList.remove('hidden') :
            searchTrackContainerTableHead.classList.add('hidden');

        const searchTrackHeader = document.getElementById('search-track-header');
        searchTrackHeader.innerHTML = foundTracks.length > 0 ? `Tracks (${foundTracks.length})` : '';

        const foundPlaylists = result.playlists;
        View.displayPlaylistsAsGrid(searchResultsContainers.searchPlaylistContainer, foundPlaylists);
        const searchPlaylistHeader = document.getElementById('search-playlist-header');
        searchPlaylistHeader.innerHTML = foundPlaylists.length > 0 ? `Playlists (${foundPlaylists.length})` : '';

        const totalResult = foundArtists.length + foundAlbums.length + foundTracks.length + foundPlaylists.length;
        const nothingFoundMessage = document.getElementById('search-nothing-found-message');

        if (totalResult === 0) {
            nothingFoundMessage.innerHTML = `Sorry, nothing found on '${result.searchWord}'`;
        } else {
            const numberOfResults = (totalResult === 1 ? 'result' : 'results');
            nothingFoundMessage.innerHTML = `Showing ${totalResult} ${numberOfResults} on '${result.searchWord}'`
        }
    },
    showSpinner(container) {
        const spinner = document.createElement('img');
        spinner.src = 'images/bars.svg';
        spinner.alt = 'loading resources';
        spinner.classList.add('spinner');

        container.appendChild(spinner);
    },
    getArtistSelect() {
        return View._artistSelect;
    },
    createArtistSelect(artists) {
        // creates a choices.js instance
        const artistSelect = new Choices('#artist-select', {
            position: 'bottom'
        });

        // creates <option>s containing all artists from Api
        const choices = artists.map(artist => {
            return {
                value: artist._id, label: `<p class="text-lg">${artist.name}</p>`,
                customProperties: {
                    albums: artist.albums
                }
            }
        });

        // placing the <option>s inside of artistSelect
        artistSelect.setChoices(choices, 'value', 'label', true);
        View._artistSelect = artistSelect;
    },
    getAlbumSelect() {
        return View._albumSelect;
    },
    createAlbumSelect(albums) {
        // creates a choices.js instance
        const albumSelect = new Choices('#album-select', {
            position: 'bottom'
        });

        // creates <option>s containing all albums from Api
        const choices = albums.map(album => {
            return {
                value: album._id, label: `<p class="text-lg">${album.title}</p>`
            }
        });

        // placing the <option>s inside of artistSelect
        albumSelect.setChoices(choices, 'value', 'label', true);
        View._albumSelect = albumSelect;
    },
    getTrackArtistSelect() {
        return View._trackArtistSelect;
    },
    createTrackArtistSelect(artists) {
        // creates a choices.js instance
        const trackArtistSelect = new Choices('#track-artist-select', {
            position: 'bottom'
        });

        /* creates <option>s containing all artists from Api but only matching artist(s)
        to the album the user selects */
        View.getAlbumSelect().passedElement.addEventListener('choice', event => {
            const albumId = event.detail.choice.value;

            const filteredArtists = trackArtistSelect.store.getChoices().map(choice => {
                return ({
                    value: choice.value,
                    label: choice.label,
                    customProperties: choice.customProperties,
                    disabled: choice.customProperties.albums.indexOf(albumId) < 0
                });
            });

            trackArtistSelect.setChoices(filteredArtists, 'value', 'label', true);
            trackArtistSelect.enable();
        });

        // creates <option>s containing all artists from Api
        const choices = artists.map(artist => {
            return {
                value: artist._id, label: `<p class="text-lg">${artist.name}</p>`,
                customProperties: {
                    albums: artist.albums
                }
            }
        });

        // placing the <option>s inside of the selects
        trackArtistSelect.setChoices(choices, 'value', 'label', true)
        trackArtistSelect.disable();
        View._trackArtistSelect = trackArtistSelect;

    },
    getPLaylistTrackSelect() {
        return View._playlistTrackSelect;
    },
    createPlaylistTrackSelect(tracks) {
        // creates a choices.js instance
        const playlistTrackSelect = new Choices('#playlist-track-select', {
            position: 'bottom'
        });

        // creates <option>s containing all tracks from Api
        const choices = tracks.map(track => {
            return {
                value: track._id,
                label: `<p class="font-semibold text-lg">${track.title}</p>
                        <p>${track.artists.map(artist => artist.name).join(', ')}</p>`,
            }
        });

        // placing the <option>s inside of playlistTrackSelect
        playlistTrackSelect.setChoices(choices, 'value', 'label', true);
        View._playlistTrackSelect = playlistTrackSelect;
    }
}