import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
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
  TextField,
  Button
} from '@mui/material';
import { api } from '../lib/api';

const InventorySettings = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    itemName: '',
    current_quantity: '',
    min_required: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);
  const fetchInventory = () => {
    api.get('inventory')
      .then(res => {
        setInventory(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading inventory:', err);
        setLoading(false);
      });
  }

  const handleMinChange = (itemName, value) => {
    const newInventory = inventory.map(item =>
      item.itemName === itemName
        ? { ...item, min_required: Math.max(0, Number(value)) }
        : item
    );
    setInventory(newInventory);
  };
  const handleAddItem = () => {
    api.post('inventory', newItem)
      .then(() => {

        fetchInventory();
        setNewItem({ itemName: '', current_quantity: '', min_required: '' });
      })
      .catch(error => {
        console.error("Error adding item:", error);
      });
  };

  const handleSave = () => {
    api.put('inventory', { inventory })
      .then(() => {
        toast.success('Minimum levels updated successfully!');
      })
      .catch(err => {
        toast.error('Error updating inventory!');
      });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Box sx={{ m: 4 }}>
        <Typography variant="h5" gutterBottom>
          Set Minimum Stock Levels
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Current Quantity</strong></TableCell>
                <TableCell><strong>Minimum Required</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.current_quantity}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.min_required}
                      onChange={(e) =>
                        handleMinChange(item.itemName, e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Box>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          label="Product Name"
          value={newItem.itemName}
          onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
        />
        <TextField
          label="Current Quantity"
          type="number"
          value={newItem.current_quantity}
          onChange={(e) => setNewItem({ ...newItem, current_quantity: e.target.value })}
        />
        <TextField
          label="Minimum Required"
          type="number"
          value={newItem.min_required}
          onChange={(e) => setNewItem({ ...newItem, min_required: e.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddItem}
        >
          Add Product
        </Button>
      </Box>

    </div>
  );
};

export default InventorySettings;
