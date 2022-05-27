const mongoose = require('mongoose')

const anime_list = new mongoose.Schema({
    title: {
        type: String
    },
    data: {
        type: Array
    },
})

module.exports = mongoose.model('Download', anime_list)