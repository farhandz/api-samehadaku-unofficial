const express = require('express')
const router  = express.Router()
const MainController = require('../controller/main.controller')

router.get('/home', MainController.getDetailAnime)

module.exports = router