import { Router } from 'express';
import db from '../utils/db.js';
const router = Router();

router.post('/purchase', async (req, res) => {
    const cart = req.body; 
    const orderedItems = Object.keys(cart);

    try {
              for (const [itemName, quantity] of Object.entries(cart)) {
            await db.promise().query(`
          UPDATE inventory
          SET current_quantity = current_quantity - ?
          WHERE itemName = ?
        `, [quantity, itemName]);
        }  // Take it out of stock

        
        const [allLowStock] = await db.promise().query(`
        SELECT itemName, min_required, current_quantity
        FROM inventory
        WHERE current_quantity < min_required
      `);// Check to see what went under the minimum


        const unavailableItems = [];
        const lowStockItems = allLowStock.map(row => row.itemName);
        const groupedBySupplier = {};

        for (const item of allLowStock) {
            const { itemName } = item;

            const [products] = await db.promise().query(`
  SELECT id, price, supplier_id
  FROM products
  WHERE itemName = ?
  ORDER BY price ASC
  LIMIT 1
`, [itemName]);


          
  if (products.length === 0) {
    if (orderedItems.includes(itemName)) {
      unavailableItems.push(itemName);
    }
    continue; 
  }



            const product = products[0];
            const neededQuantity = item.min_required - item.current_quantity;
            if (neededQuantity <= 0) continue;

            
            if (!groupedBySupplier[product.supplier_id]) {
                groupedBySupplier[product.supplier_id] = [];
            }

            groupedBySupplier[product.supplier_id].push({
                product_id: product.id,
                quantity: neededQuantity,
                price: product.price
            });
        }

                for (const supplierId in groupedBySupplier) {
            const products = groupedBySupplier[supplierId];
            const totalPrice = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

            const [orderResult] = await db.promise().query(`
          INSERT INTO orders (supplier_id, total_price, status)
          VALUES (?, ?, null)
        `, [supplierId, totalPrice]);

            const orderId = orderResult.insertId;

            const values = products.map(p => [orderId, p.product_id, p.quantity]);
            await db.promise().query(`
          INSERT INTO order_products (order_id, product_id, quantity)
          VALUES ?
        `, [values]);
        }// Send the orders to each supplier

        res.status(200).json({
            message: "Purchase successful",
            autoOrderTriggered: true,
            unavailableItems, // Ordered items that the suppliers don’t have
            lowStockItems  // All items that are below the minimum
        });
    } catch (err) {
        console.error("Error in purchase:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
