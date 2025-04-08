import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "sonner";

const AUTH_KEY = 'auth';

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem(AUTH_KEY)));

    useEffect(() => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    }, [auth])

    const login = async ({ phone, password }) => {
        if (!phone || !password) {
            toast.error("Please provide valid phone and password.")
            return;
        }

        try {
            const { data } = await api.post("suppliers/signin", {
                phone,
                password,
            });

            setAuth(data);
            navigate('/supplierOrders', { state: { supplierId: data.id } });
            toast.success("Successfuly loged in!");
        } catch (error) {
            toast.error("Authentication failed.")
        }
    }

    const signUp = async (registrationData) => {
        try {
            const { data } = await api.post('suppliers', registrationData);

            setAuth(data);
            navigate('/supplierOrders', { state: { supplierId: data.id } });
            toast.success('Registration successful!');
        } catch (error) {
            console.log(error)
            toast.error("Unable to create sublier. Try again later.");
        }
    }

    const logout = () => {
        setAuth(null);
        navigate("/");
    }

    return (<AuthContext.Provider value={{ auth, login, logout, signUp, }}>
        {children}
    </AuthContext.Provider>);
}

export function useAuth() {
    return useContext(AuthContext);
}
