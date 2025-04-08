import { Router } from 'express';
import db from '../utils/db.js';
const router = Router();

router.get('/:supplierId', (req, res) => {
    const supplierId = req.params.supplierId;
  
    const sql = `SELECT * FROM products WHERE supplier_id = ?`;
  
    db.query(sql, [supplierId], (err, results) => {
      if (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(200).json(results);
      }
    });
  });
  export default router;
