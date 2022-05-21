const express = require('express')
const router  = express.Router()
const MainController = require('../controller/main.controller')

router.get('/detail/:url_anime', MainController.getDetailAnime);
router.get('/batch', MainController.getBatch);
router.get('/new/episode', MainController.getNewEpisode);
router.get('/all', MainController.getAllListAnime);

module.exports = router