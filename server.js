const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gradebook.html')));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Gradebook_Phillpotts',
    password: 'CTI_110_Waketech',
    port: 5432,
});

app.get('/api/grades', async (req, res) => {
    try {
        const result = await pool.query('SELECT last_name, first_name, assignment1, assignment2, assignment3 FROM grades');
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));