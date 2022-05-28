const mongoose = require('mongoose')

const NewAnimeSchema = new mongoose.Schema({
    date: {
        type: String
    },
    data: {
        type: Array
    }
})

module.exports = mongoose.model('NewAnime', NewAnimeSchema)