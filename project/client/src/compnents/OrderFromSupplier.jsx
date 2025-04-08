import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "sonner";
import {
  CircularProgress,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Grid,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const OrderFromSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [editItemName, setEditItemName] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('suppliers')
      .then(response => {
        setSuppliers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error);
        setLoading(false);
      });
  }, []);

  const handleSupplierChange = async (event) => {
    const supplierId = event.target.value;
    setSelectedSupplierId(supplierId);

    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    try {
      const { data: products } = await api.get(`products/${supplierId}`);

      const initialQuantities = {};
      products.forEach(product => {
        initialQuantities[product.itemName] = product.minQuantity;
      });

      setQuantities(initialQuantities);
      setSelectedSupplier({ ...supplier, products });
      setSelectedProducts([]);
      setOrderList([]);
    } catch (error) {
      toast.error("Error fetching supplier's products. Try Again later.");
    }
  };


  const handleCheckboxChange = (product) => {
    const exists = selectedProducts.find(p => p.itemName === product.itemName);
    if (exists) {
      setSelectedProducts(prev => prev.filter(p => p.itemName !== product.itemName));
    } else {
      setSelectedProducts(prev => [
        ...prev,
        {
          id: product.id,
          itemName: product.itemName,
          price: product.price,
          quantity: quantities[product.itemName] || product.minQuantity
        }
      ]);
    }
  };


  const handleQuantityChange = (itemName, minQuantity, value) => {
    const quantity = Math.max(Number(value), minQuantity);
    console.log(quantity)
    setQuantities(prev => ({ ...prev, [itemName]: quantity }));

    setSelectedProducts(prev =>
      prev.map(p =>
        p.itemName === itemName ? { ...p, quantity } : p
      )
    );
  };

  const handleAddToOrder = () => {
    const existingItems = selectedProducts.filter(p =>
      orderList.some(existing => existing.itemName === p.itemName)
    );

    const newItems = selectedProducts.filter(p =>
      !orderList.some(existing => existing.itemName === p.itemName)
    );

    if (existingItems.length > 0) {
      const names = existingItems.map(p => p.itemName).join(', ');
      toast.warning(`These products are already included in the order: ${names}`);
    }

    if (newItems.length > 0) {
      setOrderList(prev => [...prev, ...newItems]);
    }

    setSelectedProducts([]);
  };

  const handleRemoveFromOrder = (itemName) => {
    setOrderList(prev => prev.filter(p => p.itemName !== itemName));
  };

  const handleEditQuantityChange = (itemName, value) => {
    const minQuantity =
      selectedSupplier?.products.find(p => p.itemName === itemName)?.minQuantity || 1;

    const quantity = Math.max(Number(value), minQuantity);

    setOrderList(prev =>
      prev.map(p =>
        p.itemName === itemName ? { ...p, quantity } : p
      )
    );
  };

  const submitOrder = async () => {
    if (!selectedSupplierId || orderList.length === 0) {
      toast.warning("Select a supplier and add products to the order");
      return;
    }

    const totalPrice = orderList.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    try {
      await api.post('orders', {
        supplier_id: selectedSupplierId,
        products: orderList,
        total_price: totalPrice
      });

      toast.success("Order sent successfully!");

      setOrderList([]);
      setSelectedProducts([]);
    } catch (error) {
      toast.error("An error occurred while sending the order");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={4} sx={{ m: 2 }}>
      <Grid item xs={12} md={7}>
        <Typography variant="h6" gutterBottom>Select Supplier</Typography>
        <FormControl fullWidth>
          <InputLabel id="supplier-select-label">Supplier</InputLabel>
          <Select
            labelId="supplier-select-label"
            value={selectedSupplierId}
            onChange={handleSupplierChange}
            label="supplier"
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.company_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSupplier && selectedSupplier.products && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>The supplier's products</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Select</strong></TableCell>
                    <TableCell><strong>Product Name</strong></TableCell>
                    <TableCell><strong>Quantity</strong></TableCell>
                    <TableCell><strong>Unit Price</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedSupplier.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={!!selectedProducts.find(p => p.itemName === product.itemName)}
                          onChange={() => handleCheckboxChange(product)}
                        />
                      </TableCell>
                      <TableCell>{product.itemName}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={quantities[product.itemName] || product.minQuantity}
                          onChange={(e) =>
                            handleQuantityChange(product.itemName, product.minQuantity, e.target.value)
                          }
                          slotProps={{ input: { min: product.quantity } }}
                        />
                      </TableCell>
                      <TableCell>{product.price} ₪</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToOrder}
                disabled={selectedProducts.length === 0}
              >
                Add to Order
              </Button>
            </Box>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} md={5}>
        <Typography variant="h6" gutterBottom>Current Order</Typography>
        {orderList.length === 0 ? (
          <Typography>No products have been selected.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Product Name</strong></TableCell>
                  <TableCell><strong>Quantity</strong></TableCell>
                  <TableCell><strong>Total Price</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderList.map((product, index) => {

                  console.log(product)
                  const minQuantity =
                    selectedSupplier?.products.find(p => p.itemName === product.itemName)?.minQuantity || 1;
                  return (
                    <TableRow key={index}>
                      <TableCell>{product.itemName}</TableCell>
                      <TableCell>
                        {editItemName === product.itemName ? (
                          <TextField
                            type="number"
                            size="small"
                            value={product.quantity}
                            onChange={(e) =>
                              handleEditQuantityChange(product.itemName, e.target.value)
                            }
                            slotProps={{ input: { min: minQuantity } }}
                            onBlur={() => setEditItemName(null)}
                            autoFocus
                          />
                        ) : (
                          product.quantity
                        )}
                      </TableCell>
                      <TableCell>{product.quantity * product.price} ₪</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            setEditItemName(editItemName === product.itemName ? null : product.itemName)
                          }
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleRemoveFromOrder(product.itemName)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="success"
            onClick={submitOrder}
            disabled={orderList.length === 0}
          >
            Send Order
          </Button>

          { }
          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/showOrders')}
              sx={{ width: 200 }}
            >
              Back to the orders list
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default OrderFromSupplier;
