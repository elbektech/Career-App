const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/sample.db')
const app = express()
const port = 3000

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS lorem")
  db.run('CREATE TABLE lorem (info TEXT)')
  const stmt = db.prepare('INSERT INTO lorem VALUES (?)')

  for (let i = 0; i < 10; i++) {
    stmt.run(`Ipsum ${i}`)
  }

  stmt.finalize()

  db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
    console.log(`${row.id}: ${row.info}`)
  })
})


// API to get all students
app.get('/lorem', (req,res) => {
  const sql = 'SELECT * FROM lorem';

  db.all(sql, [], (err, rows) => {
    if (err) {
    res.status(500).json({ error: err.message });
    } else {
    res.json(rows);
    }
    });
    });

    // Close the database connection when the server stops
process.on ('SIGINT', () => {
  db.close((err) => {
    if (err) {
    console.error('Error closing the database:', err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
    });
    });
  
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


