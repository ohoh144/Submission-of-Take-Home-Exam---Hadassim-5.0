import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from "../lib/api";
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

const SupplierOrders = () => {
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const supplierId = location.state?.supplierId;
  useEffect(() => {
    if (!supplierId) return;

    api.get(`orders?supplier_id=${supplierId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('There was a problem getting the orders', error);
      });
  }, [supplierId]);

  const markAsInProcess = (orderId) => {
    api.put(`orders/${orderId}`, { status: 'in process' })
      .then(() => {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: 'in process' } : order
          )
        );
      })
      .catch(error => {
        console.error('There was a problem updating the status', error);
      });
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h5" gutterBottom> Orders for the supplier</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Order number </TableCell>
              <TableCell> Products </TableCell>
              <TableCell> Total price </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              let products = [];

              try {
                products = typeof order.products === 'string'
                  ? JSON.parse(order.products)
                  : order.products;
              } catch (e) {
                console.error('Error displaying products', e);
              }

              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <ul style={{ margin: 0, paddingInlineStart: '1em' }}>
                      {products.map((p, i) => (
                        <li key={i}>{p.itemName} - {p.quantity} pcs </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{order.total_price} ₪</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {order.status !== 'completed' && order.status !== 'in process' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => markAsInProcess(order.id)}
                      >
                        Set as "in process"
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SupplierOrders;
