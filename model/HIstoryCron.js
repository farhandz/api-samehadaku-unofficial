const mongoose = require('mongoose')

const HistoryCron = new mongoose.Schema({
    type: {
        type: String
    },
    status: {
        type: Array
    },
    date: {
        type: String
    }
})

module.exports = mongoose.model('HistoryCron', HistoryCron)