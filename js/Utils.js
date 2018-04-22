const Utils = {
    getAverageRating(resource) {
        const ratings = resource.ratings;
        const ratingsTotal = ratings.reduce((sum, ratings) => sum + ratings, 0);
        const averageRating = ratings.length > 0 ? Math.floor(ratingsTotal / ratings.length) : 0;

        return averageRating;
    },
    compareAverageRating(a, b) {
        // sorts out the highest ratest album/track/playlist
        const aRating = Utils.getAverageRating(a);
        const bRating = Utils.getAverageRating(b);

        return bRating - aRating;
    },
    isFieldEmpty(field) {
        if (!field.trim()) {
            return false;
        }
        return true;
    },
    isSelectEmpty(select) {
        if (!select) {
            return false;
        }
        return true;
    },
    isDateValid(date) {
        // checks if date is formatted as YYYY-MM-DD
        if (date && !/^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(date)) {
            return false;
        }
        return true;
    },
    isSpotifyUrlValid(url){
        // checks if url is a url to spotify
        if(/^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/.test(url)){
            return true;
        }
        return false;
    }
}