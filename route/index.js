const express = require('express')
const router  = express.Router()
const MainController = require('../controller/main.controller')

router.get('/detail/:url_anime', MainController.getDetailAnime);
router.get('/batch', MainController.getBatch);

module.exports = router