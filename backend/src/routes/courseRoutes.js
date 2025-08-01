const express = require('express');
const { getCourses, addCourse } = require('../controllers/courseController');
const router = express.Router();

router.get('/', getCourses);
router.post('/', addCourse);

module.exports = router;