import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'OdelyaSQL!',
  database: 'grocery_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to DB:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

export default db;
