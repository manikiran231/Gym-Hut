const express = require('express');
const router = express.Router();

// Sample gym data
let gyms = [];

// Controller to create a new gym
const createGym = (req, res) => {
    const { name, location, facilities } = req.body;
    const newGym = { id: gyms.length + 1, name, location, facilities };
    gyms.push(newGym);
    res.status(201).json(newGym);
};

// Controller to retrieve all gyms
const getGyms = (req, res) => {
    res.status(200).json(gyms);
};

// Exporting the controller functions
module.exports = {
    createGym,
    getGyms
};