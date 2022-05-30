const express = require('express')
const router = express.Router()
const { getWeather, getStartData } = require('../controllers/Weather')





router.get('/', getWeather);
router.get('/start', getStartData)





module.exports = router