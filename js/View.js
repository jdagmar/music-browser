
const View = {
    // onArtistDelete = functions which deletes an artist
    displayArtists(artistList, artists, onArtistDelete) {
        const artistSectionHeader = document.getElementById('artist-section-header');
        artistSectionHeader.innerHTML = `Artists (${artists.length})`;

        const listAllArtist = artists.map(artist => {
            const artistContainer = document.querySelector('.artist-container-template').cloneNode(true);
            artistContainer.classList.remove('artist-container-template');

            const artistImage = artistContainer.querySelector('.artist-image');
            artistImage.src = artist.image || artist.coverImage;
            artistImage.alt = artist.name;

            artistImage.onerror = () => {
                artistImage.onerror = undefined;
                artistImage.src = 'images/103__user.svg';
                artistImage.alt = 'no image was uploaded, fallback image of user icon is in use';
            }

            const artistImageCaption = artistContainer.querySelector('.artist-image-caption');
            artistImageCaption.innerHTML = artist.name;

            const deleteArtistButton = artistContainer.querySelector('.delete-artist');
            deleteArtistButton.addEventListener('click', () => {
                onArtistDelete(artist._id, artistContainer);
            });

            return artistContainer;
        });
        artistList.innerHTML = '';
        listAllArtist.forEach(artistContainer => artistList.appendChild(artistContainer));
    },
    displayAlbums(albumList, albums, onAlbumVote) {
        const albumSectionHeader = document.getElementById('album-section-header');
        albumSectionHeader.innerHTML = `Albums (${albums.length})`;

        const listAllAlbums = albums.map(album => {
            const albumContainer = document.querySelector('.album-container-template').cloneNode(true);
            albumContainer.classList.remove('album-container-template');

            const albumImage = albumContainer.querySelector('.album-image');
            albumImage.src = album.image || album.coverImage;

            albumImage.onerror = () => {
                albumImage.onerror = undefined;
                albumImage.src = 'images/140__music.svg';
                albumImage.alt = 'no image was uploaded, fallback image of note icon is in use';
            }

            albumImage.alt = album.title;

            const albumImageCaption = albumContainer.querySelector('.album-image-caption');
            albumImageCaption.innerHTML = `
                <span class="self-center">${album.title}</span> 
                <span class="self-center">Rating: ${Utils.getAverageRating(album)}</span>`;

            const deleteAlbumButton = albumContainer.querySelector('.delete-album');
            deleteAlbumButton.addEventListener('click', () => {
                Api.deleteAlbum(album._id)
                    .then(() => albumContainer.parentNode.removeChild(albumContainer));
            });

            const albumVoteForm = albumContainer.querySelector('.album-vote-form');
            const albumRatingSelect = new Choices(albumContainer.querySelector('.album-vote'), {
                position: 'bottom',
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false
            });

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
    displayTracks(trackList, tracks) {
        const trackSectionHeader = document.getElementById('track-section-header');
        trackSectionHeader.innerHTML = `Tracks (${tracks.length})`;

        const listAllTracks = tracks.map(track => {
            const trackItem = document.querySelector('.track-item-template').cloneNode(true);
            trackItem.classList.remove('track-item-template');

            const trackRate = trackItem.querySelector('.track-rate');
            const trackTitle = trackItem.querySelector('.track-title');
            const trackArtist = trackItem.querySelector('.track-artist');

            trackTitle.innerHTML = track.title;
            trackArtist.innerHTML = track.artists.map(artist => artist.name).join(', ');
            trackRate.innerHTML = Utils.getAverageRating(track);

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
                Api.deleteTrack(track._id)
                    .then(() => trackItem.parentNode.removeChild(trackItem));
            });

            const trackVoteForm = trackItem.querySelector('.track-vote-form');
            const trackRatingSelect = new Choices(trackItem.querySelector('.track-rating'), {
                position: 'bottom',
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false
            });

            trackVoteForm.addEventListener('choice', event => {
                event.preventDefault();
                const vote = event.detail.choice.value;
                Api.voteOnTrack(track._id, vote.value);
            });

            return trackItem;
        });

        trackList.innerHTML = '';
        listAllTracks.forEach(trackItem => trackList.appendChild(trackItem));
    },
    displayPlaylistComments(commentSection, comments) {
        const listAllComments = comments.map(comment => {
            const commentItem = document.querySelector('.comment-item-template').cloneNode(true);
            commentItem.classList.remove('comment-item-template');
            const username = commentItem.querySelector('.username');
            username.innerHTML = comment.username;
            const commentText = commentItem.querySelector('.comment-text');
            commentText.innerHTML = comment.body;

            const deleteCommentButton = commentItem.querySelector('.delete-comment');

            deleteCommentButton.addEventListener('click', () => {
                Api.deletePlaylistComment(comment._id)
                    .then(() => Api.getCommentsByPlaylistId(comment.playlist))
                    .then(comments => View.displayPlaylistComments(commentSection, comments));
            });

            return commentItem;
        });

        const commentField = commentSection.querySelector('.comment-field');
        const commentFieldHeading = commentSection.querySelector('.comment-field-heading');
        commentFieldHeading.innerHTML = `Comments (${comments.length})`;

        commentField.innerHTML = '';
        listAllComments.forEach(comment => commentField.appendChild(comment));
    },
    displayPlaylists(playlistList, playlists) {
        const playlistSectionHeader = document.getElementById('playlist-section-header');
        playlistSectionHeader.innerHTML = `Playlists (${playlists.length})`;

        const listAllPlaylists = playlists.map(playlist => {
            const playlistItem = document.querySelector('.playlist-container-template').cloneNode(true);
            playlistItem.classList.remove('playlist-container-template');
            playlistItem.id = `playlist-${playlist._id}`;

            const playlistCover = playlistItem.querySelector('.playlist-cover');
            playlistCover.src = playlist.coverImage;

            playlistCover.onerror = () => {
                playlistCover.onerror = undefined;
                playlistCover.src = 'images/144__headphone.svg';
                playlistCover.alt = 'no image was uploaded, fallback image of headphones icon is in use';
            }

            playlistCover.alt = `Coverimage for the playlist ${playlist.title}`;

            const playlistTitle = playlistItem.querySelector('.playlist-title');
            playlistTitle.innerHTML = playlist.title;

            const playlistRating = playlistItem.querySelector('.playlist-rating');
            playlistRating.innerHTML = `Rating: ${Utils.getAverageRating(playlist)}`;

            const showMoreButton = playlistItem.querySelector('.show-more');
            const moreContent = playlistItem.querySelector('.more-content');

            showMoreButton.addEventListener('click', () => {
                if (moreContent.classList.contains('hidden')) {
                    moreContent.classList.remove('hidden');
                } else {
                    moreContent.classList.add('hidden');
                }
            });

            const playlistVoteForm = playlistItem.querySelector('.playlist-vote-form');
            const playlistRatingSelect = new Choices(playlistItem.querySelector('.playlist-vote'), {
                position: 'bottom',
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false
            });

            playlistVoteForm.addEventListener('choice', event => {
                event.preventDefault();
                const vote = event.detail.choice.value;
                Api.voteOnPlaylist(playlist._id, vote.value);
            });

            const playlistCreator = playlistItem.querySelector('.playlist-creator');
            playlistCreator.innerHTML = `by ${playlist.createdBy}`

            const genres = playlist.genres.map(genres => genres).join(', ');
            const playlistGenres = playlistItem.querySelector('.playlist-genres');
            playlistGenres.innerHTML = genres;

            const deletePlaylistButton = playlistItem.querySelector('.delete-playlist');
            deletePlaylistButton.addEventListener('click', () => {
                Api.deletePlaylist(playlist._id)
                    .then(() => playlistItem.parentNode.removeChild(playlistItem));
            });

            const playlistContainer = playlistItem.querySelector('.playlist');

            const commentSection = playlistItem.querySelector('.comment-section');
            View.displayPlaylistComments(commentSection, playlist.comments);

            const commentForm = playlistItem.querySelector('.comment-form');

            commentForm.addEventListener('submit', event => {
                event.preventDefault();
                const username = commentForm.elements.username;
                const body = commentForm.elements.body;
                const notifactionEmptyUser = document.querySelector('.notification-empty-username');
                const notifactionEmptyBody = document.querySelector('.notification-empty-body');

                if (!Utils.isFieldEmpty(username.value)) {
                    notifactionEmptyUser.classList.remove('hidden');
                    return;
                }

                if (!Utils.isFieldEmpty(body.value)) {
                    notifactionEmptyBody.classList.remove('hidden');
                    return;
                }

                Api.postPlaylistComment(playlist._id, body.value, username.value)
                    .then(() => Api.getCommentsByPlaylistId(playlist._id))
                    .then(comments => View.displayPlaylistComments(commentSection, comments));

                notifactionEmptyUser.classList.add('hidden');
                notifactionEmptyBody.classList.add('hidden');
                username.value = '';
                body.value = '';
            });

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

        document.getElementById(currentView).classList.remove('hidden');
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
                topTenPLaylistsItemRating.innerHTML = Utils.getAverageRating(playlist);

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
                topTenTracksItemRating.innerHTML = Utils.getAverageRating(tracks);

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
                topTenAlbumsItemRating.innerHTML = Utils.getAverageRating(albums);

                return topTenAlbumsItem;
            });

        topTenAlbumsContainer.innerHTML = '';
        topTenAlbums.forEach(topTenAlbumsItem => topTenAlbumsContainer.appendChild(topTenAlbumsItem));
    },
    displaySearchResults(result) {
        const searchArtistContainer = document.getElementById('search-artist-container');
        const foundArtists = result.artists;
        View.displayArtists(searchArtistContainer, foundArtists);

        const searchAlbumContanier = document.getElementById('search-album-container');
        const foundAlbums = result.albums;
        View.displayAlbums(searchAlbumContanier, foundAlbums);

        const searchTrackContainer = document.getElementById('search-track-container');
        const foundTracks = result.tracks;
        View.displayTracks(searchTrackContainer, foundTracks);

        const searchPlaylistContainer = document.getElementById('search-playlist-container');
        const foundPlaylists = result.playlists;
        View.displayPlaylists(searchPlaylistContainer, foundPlaylists);

    },
    showSpinner(container) {
        const spinner = document.createElement('img');
        spinner.src = 'images/bars.svg';
        spinner.alt = 'loading resources';
        spinner.classList.add('spinner');

        container.appendChild(spinner);
    }
}