import { Router } from 'express';
import db from '../utils/db.js';
const router = Router();

router.post('/', (req, res) => {
  const { supplier_id, products, total_price } = req.body;

  // שלב 1 - יצירת ההזמנה בטבלת orders
  const orderSql = `
    INSERT INTO orders (supplier_id, total_price, status)
    VALUES (?, ?,null)
  `;

  db.query(orderSql, [supplier_id, total_price], (err, result) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Database error while creating order' });
    }

    const orderId = result.insertId;

    const values = products.map(p => [
      orderId,
      p.id,
      p.quantity,
    ]);

    const insertProductsSql = `
      INSERT INTO order_products (order_id, product_id, quantity)
      VALUES ?
    `;

    db.query(insertProductsSql, [values], (err2) => {
      if (err2) {
        console.error('Error adding products to order:', err2);
        return res.status(500).json({ error: 'Database error while adding products' });
      }

      res.status(200).json({ message: 'Order created successfully' });
    });
  });
});



router.put('/:id', (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Missing status' });
  }

  db.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, orderId],
    (err, result) => {
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ message: 'שגיאה בעדכון סטטוס' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'ההזמנה לא נמצאה' });
      }

      res.json({ message: 'הסטטוס עודכן בהצלחה' });
    }
  );
});


router.get('/', (req, res) => {
  const { supplier_id } = req.query;

  let sql = `
    SELECT o.id AS order_id, o.supplier_id, o.total_price, o.status,
           op.product_id, op.quantity,
           p.itemName
    FROM orders o
    JOIN order_products op ON o.id = op.order_id
    JOIN products p ON op.product_id = p.id
  `;

  const params = [];

  if (supplier_id) {
    sql += ' WHERE o.supplier_id = ?';
    params.push(supplier_id);
  }

  sql += ' ORDER BY o.id';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    
    const ordersMap = {};
    results.forEach(row => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          supplier_id: row.supplier_id,
          total_price: row.total_price,
          status: row.status,
          products: []
        };
      }

      ordersMap[row.order_id].products.push({
        itemName: row.itemName,
        quantity: row.quantity
      });
    });

    const orders = Object.values(ordersMap);
    res.json(orders);
  });
});



export default router;
