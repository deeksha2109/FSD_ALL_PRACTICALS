const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Get rep count
app.get('/counter', (req, res) => {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    res.json({ count: data.count });
});

// Update rep count
app.post('/counter', (req, res) => {
    const { count } = req.body;
    fs.writeFileSync('data.json', JSON.stringify({ count }), 'utf8');
    res.json({ message: 'Updated successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
