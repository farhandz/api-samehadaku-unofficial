const mongoose = require('mongoose')

const anime_list = new mongoose.Schema({
    title: {
        type: String
    },
    img: {
        type: String
    },
    download: {
        type: String
    },
    description: {
        type: String
    },
})

module.exports = mongoose.model('AnimeList', anime_list)