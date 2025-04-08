import { Router } from 'express';
import db from '../utils/db.js';

const router = Router();

router.post('/signin', (req, res) => {
  const { phone, password } = req.body;

  db.query(
    'SELECT * FROM suppliers WHERE phone = ? AND password = ?',
    [phone, password],
    (err, results) => {
      if (err) {
        console.error('Signin error', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Wrong phone number or password' });
      }
      console.log('Supplier is connected', results[0]);

      res.json(results[0]); 
    }
  );
});

router.post('/', (req, res) => {
  const { companyName, phone, password, representativeName, products } = req.body;

  const supplierSql = `
    INSERT INTO suppliers (company_name, phone, password, representative_name)
    VALUES (?, ?, ?, ?)
  `;

  db.query(supplierSql, [companyName, phone, password, representativeName], (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'Unable to create new suplier. Please provide valid data.' });
    }

    const supplierId = result.insertId; // Get the ID of the supplier that was just added

       if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(201).json({ message: 'Supplier registered successfully (no products)' });
    }

    const productSql = `
      INSERT INTO products (price, itemName, minQuantity, supplier_id)
      VALUES ?
    `;

    const productValues = products.map(p => [
      p.price,
      p.itemName,
      p.quantity,     
      supplierId
    ]);

    db.query(productSql, [productValues], (err2, result2) => {
      if (err2) {
        console.error('Product insert error:', err2);
        return res.status(400).json({ error: 'Database error while inserting products' });
      }

      res.status(201).json({ message: 'Supplier and products registered successfully' });
    });
  });
});


router.get('/', (req, res) => { // GET request that returns all suppliers including their IDs
    const sql = `SELECT * FROM suppliers`;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        
  
        res.status(200).json(results);
      }
    });
  });
  
export default router;
