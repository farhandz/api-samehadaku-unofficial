const mongoose = require('mongoose')

const DetailAnimeSchema = new mongoose.Schema({
    titles: {
        type: String
    },
    descAnime: {
        type: String
    },
    genreAnime: {
        type: Array
    },
    detailAnime: {
        type: Array
    },
    status: {
        type: String
    },
    listEpisode: {
        type: Array
    }
})

module.exports = mongoose.model('DetailAnime', DetailAnimeSchema)