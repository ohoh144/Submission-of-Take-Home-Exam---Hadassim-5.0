import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import supplierRoutes from './routes/suppliers.js';
import ordersRouter from './routes/orders.js'
import ProductsRouter from './routes/products.js'
import StoreRouter from './routes/store.js'
import InvntoryRouter from './routes/inventory.js'
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', InvntoryRouter);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', ProductsRouter);
app.use('/api/store', StoreRouter);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
