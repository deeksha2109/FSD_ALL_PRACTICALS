const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.get('/logs', (req, res) => {
    const logFilePath = path.join(__dirname, 'logs', 'error.txt');

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err.message);
            return res.status(500).type('text/plain').send(
                err.code === 'ENOENT'
                    ? 'Log file not found.'
                    : 'Unable to access the log file.'
            );
        }

        res.type('text/plain'); // ✅ Force plain text output
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/logs`);
});
