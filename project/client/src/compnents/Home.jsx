import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
const Home = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: 2,
            }}
        >

            <Typography variant="h4" gutterBottom>
                Welcome
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/signUp')}
                sx={{ width: 200 }}
            >
                Supplier
            </Button>

            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/showOrders')}
                sx={{ width: 200 }}
            >
                Grocery Store Owner
            </Button>
        </Box>
    );
};

export default Home;
