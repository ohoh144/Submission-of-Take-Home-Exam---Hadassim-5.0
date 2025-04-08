import './App.css';
import { Toaster } from "sonner";
import { Routes, Route } from 'react-router-dom';
import Home from './compnents/Home';
import SignUp from './compnents/SignUp';
import OrderFromSupplier from './compnents/OrderFromSupplier';
import ShowOrders from './compnents/ShowOrders';
import AppTheme from './shared-theme/AppTheme';
import { CssBaseline } from '@mui/material';
import SupplierOrders from './compnents/SupplierOrders';
import SignIn from './compnents/SignIn';
import InventorySettings from './compnents/InventorySettings';
import { Navbar } from './compnents/Navbar';
import { AuthProvider } from './hooks/useAuth';

function App(props) {
  return (
    <AuthProvider>
      <Toaster />

      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/supplierOrders" element={<SupplierOrders />} />
          <Route path="/order" element={<OrderFromSupplier />} />
          <Route path="/showOrders" element={<ShowOrders />} />
          <Route path="/inventory" element={<InventorySettings />} />
        </Routes>
      </AppTheme>
    </AuthProvider>
  );
}

export default App;
