const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'Gradebook_Phillpotts',
  password: 'CTI_110_Waketech', // Replace with your PostgreSQL password
  port: 5432,
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve gradebook.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'gradebook.html'));
});

// API route to fetch grades
app.get('/api/grades', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.student_id,
        s.first_name,
        s.last_name,
        MAX(CASE WHEN a.assignment_id = 'assignment1' THEN a.grade END) as assignment1,
        MAX(CASE WHEN a.assignment_id = 'assignment2' THEN a.grade END) as assignment2,
        MAX(CASE WHEN a.assignment_id = 'assignment3' THEN a.grade END) as assignment3
      FROM Students s
      LEFT JOIN Assignments a ON s.student_id = a.student_id
      GROUP BY s.student_id, s.first_name, s.last_name
      ORDER BY s.last_name, s.first_name
    `);
    const grades = result.rows.map(row => ({
      studentName: `${row.first_name} ${row.last_name}`,
      assignment1: row.assignment1 || 'N/A',
      assignment2: row.assignment2 || 'N/A',
      assignment3: row.assignment3 || 'N/A',
    }));
    res.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:3000/`);
});