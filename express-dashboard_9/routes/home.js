const express = require('express');
const router = express.Router();

// GET /
router.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

// GET /home
router.get('/home', (req, res) => {
    res.send('Welcome to the Dashboard!');
});

module.exports = router;