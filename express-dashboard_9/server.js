// app.js
const express = require('express');
const app = express();

const homeRouter = require('./routes/home');
app.use('/', homeRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
