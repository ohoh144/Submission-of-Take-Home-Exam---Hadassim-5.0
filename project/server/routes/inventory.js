import { Router } from 'express';
import db from '../utils/db.js';
const router = Router();

router.get('/', (req, res) => {
    const sql = `
      SELECT itemName, current_quantity, min_required
      FROM inventory
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching inventory:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.json(results);
    });
  });
  router.put('/', (req, res) => {
    const { inventory } = req.body;
  
    if (!Array.isArray(inventory)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
  
    const updatePromises = inventory.map(item => {
      return db.promise().query(
        `UPDATE inventory SET min_required = ? WHERE itemName = ?`,
        [item.min_required, item.itemName]
      );
    });
  
    Promise.all(updatePromises)
      .then(() => {
        res.json({ message: 'Inventory minimum levels updated successfully' });
      })
      .catch(err => {
        console.error('Error updating inventory:', err);
        res.status(500).json({ error: 'Database update error' });
      });
  });
  router.post('/', (req, res) => {
    const { itemName, current_quantity, min_required } = req.body;
  
    const sql = `
      INSERT INTO inventory (itemName, current_quantity, min_required)
      VALUES (?, ?, ?)
    `;
  
    db.query(sql, [itemName, current_quantity, min_required], (err) => {
      if (err) {
        console.error('Error inserting inventory item:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Item added to inventory' });
    });
  });
  
  export default router;
