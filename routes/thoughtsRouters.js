const express = require('express')
const router = express.Router()

//Controller
const ThoughtsController = require('../controllers/ThoughtsController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', checkAuth,ThoughtsController.dashboard)
router.post('/delete', checkAuth, ThoughtsController.deleteThougth)
router.get('/edit/:id', checkAuth, ThoughtsController.editThougth)
router.post('/edit/:id', checkAuth, ThoughtsController.editThougthSave)
router.get('/add', checkAuth,ThoughtsController.createThougth)
router.post('/add', checkAuth, ThoughtsController.createThougthSave)
router.get('/search', ThoughtsController.searchThoughts)
router.get('/asc', ThoughtsController.orderAscThoughts)
router.get('/desc', ThoughtsController.orderDescThoughts)
router.get('/', ThoughtsController.showThoughts)

module.exports = router
