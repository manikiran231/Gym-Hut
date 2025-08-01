const Course = require('../models/courseModel');

exports.getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

exports.addCourse = async (req, res) => {
  const { name, description } = req.body;
  const course = new Course({ name, description });
  await course.save();
  res.status(201).send('Course added');
};