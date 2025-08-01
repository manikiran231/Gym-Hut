const express = require('express');
const router = express.Router();
const gymController = require('../controllers/index');

// Define routes for gym operations
router.get('/gyms', gymController.getGyms);
router.post('/gyms', gymController.createGym);
router.get('/gyms/:id', gymController.getGymById);
router.put('/gyms/:id', gymController.updateGym);
router.delete('/gyms/:id', gymController.deleteGym);

module.exports = router;