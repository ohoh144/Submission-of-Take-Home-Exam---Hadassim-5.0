import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from '@mui/material';
import { useAuth } from "../hooks/useAuth";

const SignIn = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper sx={{ p: 4, width: 300 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Supplier login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            name='phone'
            fullWidth
            label="Phone number"
            type="tel"
            value={formData['phone']}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            name='password'
            label="Password"
            type="password"
            value={formData['password']}
            onChange={handleChange}
            margin="normal"
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Log in
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignIn;
