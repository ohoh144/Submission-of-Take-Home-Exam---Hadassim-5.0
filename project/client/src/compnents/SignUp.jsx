import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ItemList from './ItemList';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [phoneError, setPhoneError] = React.useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [items, setItems] = React.useState([]);
  const [item, setItem] = React.useState({ itemName: "", quantity: "", price: "" });

  const submitSupplier = async (data) => {
    await signUp({
      companyName: data.get('name'),
      phone: data.get('phone'),
      password: data.get('password'),
      representativeName: data.get('representativeName'),
      products: data.get('products'),
    });
  };

  const validateInputs = () => {
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const name = document.getElementById('name');

    let isValid = true;

    if (!phone.value || !/^(?:\+972|0)(?:[23489]|5[0-9])[-]?\d{7}$/.test(phone.value)) {
      setPhoneError(true);
      setPhoneErrorMessage('Please enter a valid Israeli phone number.');
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (confirmPassword.value !== password.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Company name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nameError || phoneError || passwordError || confirmPasswordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    data.delete("itemName");
    data.delete("quantity");
    data.delete("price");
    data.append("products", JSON.stringify(items));

    await submitSupplier(data);
  };

  return (

    <SignUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Supplier Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto', border: '1px solid lightgray', padding: 2, }}
        >
          <FormControl>
            <FormLabel htmlFor="name">Company Name</FormLabel>
            <TextField
              autoComplete="organization"
              name="name"
              required
              fullWidth
              id="name"
              placeholder="Tnuva"
              error={nameError}
              helperText={nameErrorMessage}
              color={nameError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="phone">Phone Number</FormLabel>
            <TextField
              required
              fullWidth
              id="phone"
              placeholder="0501234567"
              name="phone"
              autoComplete="tel"
              variant="outlined"
              error={phoneError}
              helperText={phoneErrorMessage}
              color={phoneError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="representativeName">Representative Name</FormLabel>
            <TextField
              required
              fullWidth
              id="representativeName"
              name="representativeName"
              placeholder="Odelya"
              autoComplete="name"
            />
          </FormControl>
          <ItemList item={item} setItem={setItem} items={items} setItems={setItems}></ItemList>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              placeholder="••••••"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              variant="outlined"
              error={confirmPasswordError}
              helperText={confirmPasswordErrorMessage}
              color={confirmPasswordError ? 'error' : 'primary'}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Sign up
          </Button>
        </Box>
        <Divider>
          <Typography sx={{ color: 'text.secondary' }}>or</Typography>
        </Divider>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={() => navigate('/signIn')}
        >
          Sign in
        </Button>
      </Card>

    </SignUpContainer>
  );
}
