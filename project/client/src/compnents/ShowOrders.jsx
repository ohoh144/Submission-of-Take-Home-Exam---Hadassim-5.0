import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const ShowOrders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get('orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));

    api.get('suppliers')
      .then(response => {
        const map = {};
        response.data.forEach(s => {
          map[s.id] = s.company_name;
        });
        setSuppliers(map);
      })
      .catch(error => console.error('Error fetching suppliers:', error));
  }, []);

  const markAsCompleted = (id) => {
    api.put(`orders/${id}`, { status: 'completed' })
      .then(() => {
        setOrders(prev =>
          prev.map(order => order.id === id ? { ...order, status: 'completed' } : order)
        );
      })
      .catch(error => console.error('Error updating status', error));
  };

  return (
    <Box sx={{ m: 4 }}>
      { }
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/order')}
        >
          New order from supplier
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/inventory')}
        >
          Inventory Settings
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>Store owner's order list</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order number</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Total price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{suppliers[order.supplier_id] || 'Loading...'}</TableCell>
                <TableCell>
                  <ul style={{ margin: 0, paddingInlineStart: '1em' }}>
                    {order.products.map((p, i) => (
                      <li key={i}>{p.itemName} - {p.quantity} pcs</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{order.total_price} ₪</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {order.status !== 'completed' && order.status === 'in process' && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => markAsCompleted(order.id)}
                    >
                      Set as "completed"
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShowOrders;
