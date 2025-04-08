import React, { useState } from "react";
import { Typography,TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material";

const ItemList = ({item,setItem,items ,setItems}) => {
  const addItem = () => {
    if (item.itemName && item.quantity && item.price) {
      setItems([...items, { ...item, quantity: Number(item.quantity), price: Number(item.price) }]);
      setItem({ itemName: "", quantity: "", price: "" });
    }
  };

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  

  return (
    <div style={{ padding: 20 }}>
      <Box  sx={{display: 'flex' ,flexDirection: 'column',justifyContent: 'space-between' ,gap: 2}}>
      <TextField label="Item Name" name="itemName" value={item.itemName} onChange={handleChange} variant="outlined"  />
      <TextField label="Quantity" name="quantity" type="number" value={item.quantity} onChange={handleChange} variant="outlined"  />
      <TextField label="Price" name="price" type="number" value={item.price} onChange={handleChange} variant="outlined"  />
      <Button variant="contained" color="primary" onClick={addItem}>Add Item</Button>
      </Box>
      
      
      <TableContainer component={Paper} style={{ marginTop: 20  } }>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Quantity</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Price</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ItemList;